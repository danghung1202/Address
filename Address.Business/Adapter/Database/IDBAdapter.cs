using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;

namespace Adapter.DataBase
{
    public interface IDBAdapter:IDisposable
    {
        /// <summary>
        /// Thiết lập lại danh sách tham số của truy vấn về 0.
        /// </summary>
        void ResetParams();

        /// <summary>
        /// Thêm tham số cho truy vấn.
        /// </summary>
        /// <param name="typeParam"></param>
        /// <param name="nameParam"></param>
        /// <param name="valueParam"></param>
        /// <param name="isOuputParam"></param>
        void AddParam(SqlDbType typeParam, string nameParam, object valueParam, bool isOuputParam=false, int paramSize=Int32.MaxValue);

        /// <summary>
        /// Lấy giá trị của tham số trong command, bao gồm cả Input, Output parameter
        /// </summary>
        /// <param name="nameParam">Tên của tham số, vd: "@id", "@return"</param>
        /// <returns>Giá trị của tham số</returns>
        object GetParam(string nameParam);

        /// <summary>
        /// <para>Lấy giá trị của tham số "@return" trả về trong Stored Procedure.</para>
        /// <para>Chú ý: Phải close SqlDataReader mới lấy được giá trị "@return" =.=".</para>
        /// </summary>
        /// <returns></returns>
        object GetReturn();

        /// <summary>
        /// <para>Thực hiện 1 câu truy vấn thông thường</para>
        /// <example><code>SqlDataReader.ExecuteSqlStatement("select * from db.Table")</code></example>
        /// </summary>
        /// <param name="sqlStatement"></param>
        /// <returns></returns>
        SqlDataReader ExecuteSqlStatement(string sqlStatement);

        /// <summary>
        /// <para>Thực hiện StoreProcedure.</para>
        /// <para>Chú ý: Thêm tham số(nếu có, bằng <see cref="ADODataAdapter.AddParam(...)"/>) trước
        /// khi gọi thủ tục này</para>
        /// <para>Nhớ đóng SqlDataReader khi dùng xong.</para>
        /// </summary>
        /// <param name="procedureName">Tên của thủ tục</param>
        /// <param name="returnType">Trả lại SqlDataReader.</param>
        /// <returns></returns>
        SqlDataReader Select(string procedureName, SqlDbType returnType = SqlDbType.Int);

        /// <summary>
        /// Thực hiện một Insert Stored Procedure
        /// Trong thủ tục phải có RETURN @@rowcount để kiểm tra thực hiện insert thành công hay không.
        /// </summary>
        /// <param name="procedureName">Tên Stored Procedure</param>
        /// <returns>True nếu có dòng mới được thêm vào</returns>
        bool Insert(string procedureName);

        /// <summary>
        /// Thực hiện một Update Stored Procedure.
        /// Trong thủ tục phải có RETURN @@rowcount để kiểm tra thực hiện update thành công hay không.
        /// </summary>
        /// <param name="procedureName">Tên Stored Procedure</param>
        /// <returns>True nếu có dữ liệu bị thay đổi</returns>
        bool Update(string procedureName);

        /// <summary>
        /// Thực hiện một Delete Stored Procedure
        /// Trong thủ tục phải có RETURN @@rowcount để kiểm tra thực hiện delete thành công hay không
        /// </summary>
        /// <param name="procedureName">Tên Stored Procedure</param>
        /// <returns>True nếu có dũ liệu bị xóa</returns>
        bool Delete(string procedureName);

        /// <summary>
        /// Hủy các tài nguyên.
        /// </summary>
        void Dispose();
        
    }
}
