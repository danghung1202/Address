using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Adapter.DataBase;
using System.Data;
using System.Data.SqlClient;
using Address.Business.Entities;

namespace Address.Business.Repositories
{
    public class AddressRepository: BaseRepository
    {
        /// <summary>
        /// Thêm mới địa chỉ, kiem tra user chua ton tai cung them vao luon
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public bool Address_Add(Entities.Address address)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_Center", address.A_Center);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@A_Border", address.A_Border);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_ParentID", address.A_ParentID);
            _dbAdapter.AddParam(SqlDbType.TinyInt, "@A_Level", address.A_Level);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@A_Name", address.A_Name);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@A_Description", address.A_Description);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_CreatedByUser", address.A_CreatedByUser);

            return _dbAdapter.Insert("Address_Add");
        }

        /// <summary>
        /// Đánh dấu xóa địa chỉ
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public bool Address_Delete(string A_ID, string U_User, string Reasons)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_ID", A_ID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@UserID", U_User);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@Reason", Reasons);

            return _dbAdapter.Insert("Address_Delete");
        }

        /// <summary>
        /// Restore lịch sử đồng thời review luôn bản ghi đó. Admin, cộng tác viên khi xem lịch sử của địa chỉ, sẽ có nút Restore bên cạnh luôn. Có thể xem trong view or backend, tùy vào quyền mà hiện
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public bool Address_RestoreFromHistory(string H_ID, string UserID)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_ID", H_ID);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@UserID", UserID);
           
            return _dbAdapter.Insert("Address_RestoreFromHistory");
        }
        /// <summary>
        /// Lấy danh sách các địa chỉ theo id cha và chi tiết thông tin địa chỉ của id cha (ko bao gồm lịch sử)
        /// </summary>
        /// <param name="AddressID"></param>
        /// <returns></returns>
        public Entities.Address Address_GetDetailWithChildren(string AddressID)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@AddressID", AddressID);

            Entities.Address address = null;
            SqlDataReader reader = _dbAdapter.Select("Address_GetDetailWithChildren");
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    address = new Entities.Address();
                    address.A_ID = reader["A_ID"].ToString();
                    address.A_Center = reader["A_Center"].ToString();
                    address.A_ParentID = reader["A_ParentID"].ToString();
                    address.A_Level = int.Parse(reader["A_Level"].ToString()) ;
                    address.A_Name = (string)reader["A_Name"];
                    address.A_Description = reader["A_Description"] != DBNull.Value ? (string)reader["A_Description"] : string.Empty;
                }
            }
            reader.NextResult();
            address.Points = new List<string>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    address.Points.Add((string)reader["LongLat"]);
                }
                //reader.Close();
            }
            reader.NextResult();
            address.A_Children = new List<Entities.Address>();
            Entities.Address child = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    child = new Entities.Address();
                    child.A_ID = reader["A_ID"].ToString();
                    child.A_Level = int.Parse(reader["A_Level"].ToString());
                    child.A_Name = (string)reader["A_Name"];
                    child.A_Description = reader["A_Description"] != DBNull.Value ? (string)reader["A_Description"] : string.Empty;
                    address.A_Children.Add(child);
                }

                
            }
            reader.Close();
            return address;
        }
        /// <summary>
        /// Lấy thông tin chi tiết của một địa chỉ đã bao gồm cả lịch sử
        /// </summary>
        /// <param name="AddressID"></param>
        /// <returns></returns>
        public Entities.Address Address_GetDetailWithHistory(string AddressID, string UserID)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@AddressID", AddressID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@UserID", UserID);
            Entities.Address address = null;
            SqlDataReader reader = _dbAdapter.Select("Address_GetDetailWithHistory");
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    address = new Entities.Address();
                    address.A_ID = reader["A_ID"].ToString();
                    //address.A_Center = reader["A_Center"].ToString();
                    address.A_ParentID = reader["A_ParentID"].ToString();
                    address.A_Level = int.Parse(reader["A_Level"].ToString());
                    address.A_Name = (string)reader["A_Name"];
                    address.A_Description = reader["A_Description"] != DBNull.Value ? (string)reader["A_Description"] : string.Empty;
                    address.A_CreatedByUser = reader["A_CreatedByUser"] != DBNull.Value ? (string)reader["A_CreatedByUser"] : string.Empty;
                    address.A_CreatedOnDate = reader["A_CreatedOnDate"] != DBNull.Value ? DateTime.Parse(reader["A_CreatedOnDate"].ToString()) : DateTime.MinValue;
                    address.A_ReviewedByUser = reader["A_ReviewedByUser"] != DBNull.Value ? (string)reader["A_ReviewedByUser"] : string.Empty;
                    address.A_ReviewedOnDate = reader["A_ReviewedOnDate"] != DBNull.Value ? DateTime.Parse(reader["A_ReviewedOnDate"].ToString()) : DateTime.MinValue;
                    address.A_Status = int.Parse(reader["A_Status"].ToString());

                }
            }
            
            reader.NextResult();
            address.A_History = new List<History>();
            History history = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    history = new History();
                    history.H_ID = reader["H_ID"].ToString();
                    history.H_AddressID = reader["H_AddressID"].ToString();
                    history.H_ParentID = reader["H_ParentID"].ToString();

                    history.H_Level = int.Parse(reader["H_Level"].ToString());
                    history.H_Name = (string)reader["H_Name"];
                    history.H_Description = reader["H_Description"] != DBNull.Value ? (string)reader["H_Description"] : string.Empty;
                    history.H_CreatedByUser = reader["H_CreatedByUser"] != DBNull.Value ? (string)reader["H_CreatedByUser"] : string.Empty;
                    history.H_CreatedOnDate = reader["H_CreatedOnDate"] != DBNull.Value ? DateTime.Parse(reader["H_CreatedOnDate"].ToString()) : DateTime.MinValue;
                    history.H_ModifiedOnDate = reader["H_ModifiedOnDate"] != DBNull.Value ? DateTime.Parse(reader["H_ModifiedOnDate"].ToString()) : DateTime.MinValue;
                    history.H_Action = reader["H_Action"] != DBNull.Value ? (string)reader["H_Action"] : string.Empty;
                    history.H_ActionDetail = reader["H_ActionDetail"] != DBNull.Value ? (string)reader["H_ActionDetail"] : string.Empty;
                    history.H_Rate = reader["H_Rate"] != DBNull.Value ? (int)reader["H_Rate"] : 0;
                    history.H_Status = int.Parse(reader["H_Status"].ToString());
                    history.H_IsRestore = int.Parse(reader["H_IsRestore"].ToString());
                    history.H_IsOwner = int.Parse(reader["H_IsOwner"].ToString());
                    address.A_History.Add(history);
                }

                
            }
            reader.Close();
            return address;

        }

        /// <summary>
        /// Review va unreview địa chỉ
        /// </summary>
        /// <param name="AddressID"></param>
        /// <param name="UserID"></param>
        /// <param name="Status">= 1 (unreview) or = 2 (review)</param>
        /// <returns></returns>
        public bool Address_Review(string AddressID, string UserID, int Status)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@AddressID", AddressID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@UserID", UserID);
            _dbAdapter.AddParam(SqlDbType.TinyInt, "@A_Status", Status);

            return _dbAdapter.Insert("Address_Review");

        }

        public ResultValidate Address_AddValidate(Entities.Address add)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_ID", add.A_ID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_Center", add.A_Center);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@A_Border", add.A_Border);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_ParentID", add.A_ParentID);
            _dbAdapter.AddParam(SqlDbType.TinyInt, "@A_Level", add.A_Level);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@A_Name", add.A_Name);

            Entities.ResultValidate result = null;
            SqlDataReader reader = _dbAdapter.Select("Address_AddValidate");
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    result = new Entities.ResultValidate();
                    result.DuongBaoHopLe = int.Parse(reader["DuongBaoHopLe"].ToString());
                    result.DiemNamTrongDuongBao = int.Parse(reader["DiemNamTrongDuongBao"].ToString());
                    result.DuongBaoNamTrongDuongBao = int.Parse(reader["DuongBaoNamTrongDuongBao"].ToString());
                }
            }
            reader.NextResult();
            result.DiaDanhTrung = new List<Entities.Address>();
            Entities.Address address = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    address = new Entities.Address();
                    address.A_ID = reader["A_ID"].ToString();
                    address.A_Name = (string)reader["A_Name"];
                    address.A_Description = reader["A_Description"] != DBNull.Value ? (string)reader["A_Description"] : string.Empty;
                    address.A_CreatedByUser = reader["A_CreatedByUser"] != DBNull.Value ? (string)reader["A_CreatedByUser"] : string.Empty;
                    address.A_CreatedOnDate = reader["A_CreatedOnDate"] != DBNull.Value ? DateTime.Parse(reader["A_CreatedOnDate"].ToString()) : DateTime.MinValue;
                    address.A_Status = int.Parse(reader["A_Status"].ToString());
                    result.DiaDanhTrung.Add(address);
                }
                
            }
            reader.Close();
            return result;
        }

        public List<Address.Business.Entities.Address> Address_CheckExists(string A_ParentID, int A_Level, string A_Center)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_ParentID", A_ParentID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_Level", A_Level);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_Center", A_Center);

            List<Entities.Address> address = new List<Entities.Address>();
            SqlDataReader reader = _dbAdapter.Select("Address_CheckExists");
            Entities.Address child = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    child = new Entities.Address();
                    child.A_ID = reader["A_ID"].ToString();
                    child.A_Level = int.Parse(reader["A_Level"].ToString());
                    child.A_Name = (string)reader["A_Name"];
                    address.Add(child);
                }
            }
            reader.Close();

            return address;
        }

        public List<string> Address_GetAddressOfLocation(string A_Center)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@A_Center", A_Center);
            SqlDataReader reader = _dbAdapter.Select("Address_GetAddressOfLocation");

            List<string> addresses = new List<string>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    addresses.Add(reader["address_name"].ToString());
                }
            }
            reader.Close();

            return addresses;

        }
    }
}
