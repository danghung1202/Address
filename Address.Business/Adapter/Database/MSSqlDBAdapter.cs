using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace Adapter.DataBase
{
    /// <summary>
    /// Lớp chứa các phương thức làm việc với hệ quản trị dữ liệu Microsoft SQLSerer
    /// </summary>
    public class MSSqlDBAdapter: IDBAdapter
    {
        #region Biến thành viên (cục bộ)

        private SqlConnection _sqlConnection;
        private SqlCommand _sqlCommand;
        private SqlDataReader _sqlDataReader;
        private Dictionary<string, SqlParameter> _sqlParams;
        private string _connectName; //key name trong file config chưa connectionstring
        private string _connectionString;

        private bool disposed = false;

        #endregion

        #region Phương thức thành viên (cục bộ)

        /// <summary>
        /// Mở kết nối.
        /// </summary>
        private void OpenConnection()
        {
            if(_sqlConnection!=null && _sqlConnection.State!=ConnectionState.Open)
                _sqlConnection.Open();
        }
        /// <summary>
        /// Đóng kết nối nếu có thể.
        /// </summary>
        private void CloseConnection()
        {
            //chỉ đóng kết nối khi connection ko null
            //ko cần kiểm tra trạng thái của kết nối, vì dù đóng hay mở, close đều ko lỗi
            if (_sqlConnection != null && _sqlConnection.State!=ConnectionState.Closed)
            {
                //để đóng kết nối, dùng chỉ 1 trong 2 cái: 
                //Dispose               |   Close
                //Giải phóng hoàn toàn  |   Giải phóng, nhưng nếu có lỗi --> vẫn còn
                //Xem http://chrisfulstow.com/sqlconnection-close-or-dispose để biết rõ lựa chọn cái nào
                //ở đây do còn dùng đi dùng lại connection (Pool), nên dùng Close, ko dùng Dispose
                //Nếu dùng Dispose--> lỗi
                //_sqlConnection.Dispose();
                _sqlConnection.Close();
            }
        }

        /// <summary>
        /// Hủy các tài nguyên
        /// Nếu disposing = true: Hủy các tài nguyên quản lí đc hay ko quản lí đc
        /// Nếu disposing = false: Chỉ hủy các tài nguyên ko quản lí đc
        /// </summary>
        /// <param name="disposing"></param>
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                //hủy các tài nguyên quản lí đc
                if (disposing)
                {
                    //Xóa pool, khi đó Close/Dispose connection sẽ bị hủy hoàn toàn
                    //Nếu ko có cái này, thì connection sẽ được trả về Pool nếu Close
                    SqlConnection.ClearAllPools();
                    _sqlConnection.Dispose();
                    _sqlDataReader.Dispose();
                    _sqlCommand.Dispose();
                }
                //hủy các tài nguyên ko quản lí đc
                disposed = true;
            }
        }
        /// <summary>
        /// Nạp tham số từ <paramref name="_sqlParams"/>  tới <paramref name="command"/>
        /// </summary>
        /// <param name="command"></param>
        private void LoadParamsToCommand(SqlCommand command)
        {
            if (command == null)
                throw new ArgumentNullException("Không được dùng private method"
                    + " ADODataAdapter.LoadParamsToCommand() với tham số null!");
            else
            {
                command.Parameters.Clear();//clear cho chac
                command.Parameters.AddRange(_sqlParams.Values.ToArray());
            }
        }

        /// <summary>
        /// Thêm tham số cho <paramref name="_sqlParams"/>
        /// </summary>
        /// <param name="param"></param>
        private void AddParam(SqlParameter param)
        {
            if (_sqlParams == null)
                _sqlParams = new Dictionary<string, SqlParameter>();
            _sqlParams.Add(param.ParameterName, param);
        }

        /// <summary>
        /// Modify cơ sở dữ liệu dùng Stored Procedure.
        /// </summary>
        /// <param name="procedureName">Tên của Stored Procedure</param>
        /// <returns>True nếu cơ sở dữ liệu được modify</returns>
        private bool ModifyDB(string procedureName)
        {
            OpenConnection();
            int rowEffect = 0;
            using (_sqlCommand = new SqlCommand(procedureName, _sqlConnection))
            {
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                LoadParamsToCommand(_sqlCommand);
                SqlParameter ret = new SqlParameter("@return", SqlDbType.Int);
                ret.Direction = ParameterDirection.ReturnValue;
                _sqlCommand.Parameters.Add(ret);
                rowEffect = _sqlCommand.ExecuteNonQuery();
                //lấy tham số @return của Stored Procedure truyền vào danh sách tham số
                AddParam(_sqlCommand.Parameters["@return"]);
            }
            CloseConnection();
            return ((int)_sqlParams["@return"].Value) > 0;
        }

        #endregion

        #region Constructors
        /// <summary>
        /// <para>Khởi tạo kết nối tới cơ sở dữ liệu với ConnectionString được lấy theo 2 cách.</para>
        /// <list type="bullet">
        ///     <item>
        ///     <para>
        ///         <para>
        ///             Nếu <paramref name="isFromConfig"/> là true (mặc định), ConnectionString sẽ
        ///             lấy từ *.config, , chẳng hạn nội dung của *.config có dạng như sau:
        ///         </para>
        ///         <para>
        ///             <para>&lt;?xml version="1.0" encoding="utf-8" ?&gt;</para>
        ///             <para>&lt;configuration&gt;</para>
        ///             <para>  &lt;connectionStrings&gt;</para>
        ///             <para>      &lt;add name="ConnectCongnhDb"</para>
        ///             <para>          providerName="System.Data.SqlClient"</para>
        ///             <para>          connectionString="Server=CONGNH-PC\SQLSERVER2008R2;</para>
        ///             <para>          Integrated security=SSPI;Pooling=true;Initial Catalog=CongnhDb"/&gt;</para>
        ///             <para>  &lt;/connectionStrings&gt;</para>
        ///             <para>&lt;/configuration &gt;</para>
        ///         </para>
        ///         <para>
        ///             khi đó <paramref name="connectInfo"/> là giá trị của thuộc tính name trong *.config:
        ///             "ConnectCongnhDb"
        ///         </para>
        ///     </para>
        ///     </item>
        ///     <item>
        ///     <para>
        ///         Nếu <paramref name="isFromConfig"/> là false, ConnectionString chính là <paramref name="connectInfo"/>
        ///     </para>
        ///     </item>
        /// </list>
        /// </summary>
        /// <param name="connectInfo"></param>
        /// <param name="isFromConfig"><typeparamref name="ADODataAdapter.ConnectStrisFromConfig"/></param>
        public MSSqlDBAdapter(string connectInfo, bool isFromConfig=true)
        {
            //kiểm tra xem tham số connectInfo có null hay ko
            if (connectInfo == null)
                throw new ArgumentNullException("Không được khởi tạo ADODataAdapter với tham số null.");
            else
            {
                //Lấy ConnectionString
                if (isFromConfig)
                {
                    _connectName = connectInfo;
                    _connectionString = ConfigurationManager.ConnectionStrings[_connectName].ConnectionString;
                }
                else 
                {
                    _connectionString = connectInfo;
                }
                //Khởi tạo kết nối, tham số
                if (_connectionString == null)
                    throw new NoNullAllowedException("ConnectionString trong ADODataAdapter bị null.");
                else
                {
                    //khởi tạo sẵn kết nối, nhưng chưa mở
                    _sqlConnection = new SqlConnection(_connectionString);
                }
                _sqlParams = new Dictionary<string, SqlParameter>();
            }
        }

        /// <summary>
        /// Hàm hủy.
        /// </summary>
        ~MSSqlDBAdapter()
        {
            //Hủy các tài nguyên ko quản lí đc
            Dispose(false);
        }
        #endregion

        #region Inherit Methods

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void ResetParams()
        {
            if (_sqlParams == null)
                _sqlParams = new Dictionary<string, SqlParameter>();
            else
                _sqlParams.Clear();
        }

        public void AddParam(SqlDbType typeParam, string nameParam, object valueParam, bool isOuputParam = false, int paramSize = Int32.MaxValue)
        {
            SqlParameter param = new SqlParameter();
            param.ParameterName = nameParam;
            param.SqlDbType = typeParam;
            param.Value = valueParam==null?DBNull.Value:valueParam;
            if (isOuputParam)
            {
                param.Direction = ParameterDirection.Output;
                param.Size = paramSize;
            }
            AddParam(param);
        }

        public object GetParam(string nameParam)
        {
            SqlParameter param = _sqlParams[nameParam];
            if (param == null)
                return null;
            else
                return param.Value;
        }

        public object GetReturn()
        {
            return this.GetParam("@return");
        }

        public SqlDataReader ExecuteSqlStatement(string sqlStatement)
        {
            OpenConnection();
            using (_sqlCommand = new SqlCommand(sqlStatement, _sqlConnection))
            {
                LoadParamsToCommand(_sqlCommand);
                _sqlDataReader = _sqlCommand.ExecuteReader(CommandBehavior.CloseConnection);
            }
            return _sqlDataReader;
        }

        public SqlDataReader Select(string procedureName, SqlDbType returnType = SqlDbType.Int)
        {
            OpenConnection();
            using (_sqlCommand = new SqlCommand(procedureName, _sqlConnection))
            {
                _sqlCommand.CommandType = CommandType.StoredProcedure;
                LoadParamsToCommand(_sqlCommand);
                SqlParameter ret = new SqlParameter("@return", returnType);
                ret.Direction = ParameterDirection.ReturnValue;
                _sqlCommand.Parameters.Add(ret);
                //CommandBehavior.CloseConnection: khi SqlDataReader trả về bị đóng thì connection cũng bị đóng
                _sqlDataReader = _sqlCommand.ExecuteReader(CommandBehavior.CloseConnection);
                AddParam(_sqlCommand.Parameters["@return"]);
            }
            return _sqlDataReader;
        }

        public bool Insert(string procedureName) { return ModifyDB(procedureName); }

        public bool Update(string procedureName) { return ModifyDB(procedureName); }

        public bool Delete(string procedureName) { return ModifyDB(procedureName); }

        #endregion
    }
}
