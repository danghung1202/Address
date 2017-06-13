using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Address.Business.Entities;

namespace Address.Business.Repositories
{
    public class HistoryRepository : BaseRepository
    {
        /// <summary>
        /// User sửa một địa chỉ sẽ thêm bản ghi address vào bảng lịch sử nếu user là admin or cộng tác viên thì bản ghi này được tin tưởng và restore luôn vào địa chỉ chính thức đồng thời review luôn
        /// </summary>
        /// <param name="history"></param>
        /// <returns></returns>
        public bool History_AddAddress(Entities.History history)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_AddressID", history.H_AddressID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_Center", history.H_Center);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_Border", history.H_Border);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_ParentID", history.H_ParentID);
            _dbAdapter.AddParam(SqlDbType.TinyInt, "@H_Level", history.H_Level);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_Name", history.H_Name);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_Description", history.H_Description);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_CreatedByUser", history.H_CreatedByUser);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_ActionDetail", history.H_ActionDetail);

            return _dbAdapter.Insert("History_AddAddress");
        }

        /// <summary>
        /// User sửa một địa chỉ sẽ thêm bản ghi address vào bảng lịch sử nếu user là admin or cộng tác viên thì bản ghi này được tin tưởng và restore luôn vào địa chỉ chính thức đồng thời review luôn
        /// </summary>
        /// <param name="history"></param>
        /// <returns></returns>
        public bool History_Update(Entities.History history)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_ID", history.H_ID);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_AddressID", history.H_Center);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_Center", history.H_Center);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_Border", history.H_Border);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_ParentID", history.H_ParentID);
            _dbAdapter.AddParam(SqlDbType.TinyInt, "@H_Level", history.H_Level);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_Name", history.H_Name);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_Description", history.H_Description);
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_CreatedByUser", history.H_CreatedByUser);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@H_ActionDetail", history.H_ActionDetail);

            return _dbAdapter.Insert("History_Update");
        }

        /// <summary>
        /// Lấy các thao tác địa chỉ tương ứng với một user
        /// </summary>
        /// <param name="UserID"></param>
        /// <param name="PageNumber"></param>
        /// <param name="ItemPerPage"></param>
        /// <returns></returns>
        public List<History> History_GetAddressOfUser(string UserID, int PageNumber, int ItemPerPage)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@UserID", UserID);
            _dbAdapter.AddParam(SqlDbType.Int, "@PageNumber", PageNumber);
            _dbAdapter.AddParam(SqlDbType.Int, "@ItemPerPage", ItemPerPage);
            SqlDataReader reader = _dbAdapter.Select("History_GetAddressOfUser"); 
   
            List<History> histories = new List<History>();
            History history = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    history = new History();
                    history.H_ID = reader["H_ID"].ToString();
                    history.H_AddressID = reader["H_AddressID"].ToString();
                    //history.H_ParentID = (string)reader["H_ParentID"];

                    history.H_Level = int.Parse(reader["H_Level"].ToString());
                    history.H_Name = (string)reader["H_Name"];
                    //history.H_Description = reader["H_Description"] != DBNull.Value ? (string)reader["H_Description"] : string.Empty;
                    history.H_CreatedByUser = reader["H_CreatedByUser"] != DBNull.Value ? (string)reader["H_CreatedByUser"] : string.Empty;
                    history.H_CreatedOnDate = reader["H_CreatedOnDate"] != DBNull.Value ? DateTime.Parse(reader["H_CreatedOnDate"].ToString()) : DateTime.MinValue;
                    history.H_ModifiedOnDate = reader["H_ModifiedOnDate"] != DBNull.Value ? DateTime.Parse(reader["H_ModifiedOnDate"].ToString()) : DateTime.MinValue;
                    history.H_Action = reader["H_Action"] != DBNull.Value ? (string)reader["H_Action"] : string.Empty;
                    history.H_ActionDetail = reader["H_ActionDetail"] != DBNull.Value ? (string)reader["H_ActionDetail"] : string.Empty;
                    history.H_Rate = reader["H_Rate"] != DBNull.Value ? int.Parse(reader["H_Rate"].ToString()) : 0;
                    history.H_Status = int.Parse(reader["H_Status"].ToString());

                    history.H_Address = new Entities.Address { A_Name = (string)reader["A_Name"] };
                    histories.Add(history);
                }

                
            }
            reader.Close();
            return histories;
        }

        /// <summary>
        /// Lấy tất cả các địa chỉ có cập nhật mới nhất
        /// </summary>
        /// <param name="PageNumber"></param>
        /// <param name="ItemPerPage"></param>
        /// <returns></returns>
        public List<History> History_GetNewest(int PageNumber, int ItemPerPage)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.Int, "@PageNumber", PageNumber);
            _dbAdapter.AddParam(SqlDbType.Int, "@ItemPerPage", ItemPerPage);
            SqlDataReader reader = _dbAdapter.Select("Address_GetNewest");

            List<History> histories = new List<History>();
            History history = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    history = new History();
                    history.H_ID = reader["H_ID"].ToString();
                    history.H_AddressID = reader["H_AddressID"].ToString();
                    //history.H_ParentID = (string)reader["H_ParentID"];

                    history.H_Level = int.Parse(reader["H_Level"].ToString());
                    history.H_Name = (string)reader["H_Name"];
                    //history.H_Description = reader["H_Description"] != DBNull.Value ? (string)reader["H_Description"] : string.Empty;
                    history.H_CreatedByUser = reader["H_CreatedByUser"] != DBNull.Value ? (string)reader["H_CreatedByUser"] : string.Empty;
                    history.H_CreatedOnDate = reader["H_CreatedOnDate"] != DBNull.Value ? DateTime.Parse(reader["H_CreatedOnDate"].ToString()) : DateTime.MinValue;
                    history.H_ModifiedOnDate = reader["H_ModifiedOnDate"] != DBNull.Value ? DateTime.Parse(reader["H_ModifiedOnDate"].ToString()) : DateTime.MinValue;
                    history.H_Action = reader["H_Action"] != DBNull.Value ? (string)reader["H_Action"] : string.Empty;
                    history.H_ActionDetail = reader["H_ActionDetail"] != DBNull.Value ? (string)reader["H_ActionDetail"] : string.Empty;
                    history.H_Rate = reader["H_Rate"] != DBNull.Value ? int.Parse(reader["H_Rate"].ToString()) : 0;
                    history.H_Status = int.Parse(reader["H_Status"].ToString());

                    history.H_Address = new Entities.Address { A_Name = (string)reader["A_Name"] };
                    histories.Add(history);
                }

                
            }
            reader.Close();
            return histories;
        }
        /// <summary>
        /// Lấy các thao tác địa chỉ tương ứng với một user
        /// </summary>
        /// <param name="UserID"></param>
        /// <param name="PageNumber"></param>
        /// <param name="ItemPerPage"></param>
        /// <returns></returns>
        public History History_GetDetail(string H_ID)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@H_ID", H_ID);

            SqlDataReader reader = _dbAdapter.Select("History_GetDetail");

            History history = null;
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    history = new History();
                    history.H_ID = reader["H_ID"].ToString();
                    history.H_AddressID = reader["H_AddressID"].ToString();
                    history.H_Center = (string)reader["H_Center"];
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
                }

                //reader.Close();
            }
            reader.NextResult();
            history.Points = new List<string>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    history.Points.Add((string)reader["LongLat"]);
                }
                
            }
            reader.Close();
            return history;
        }
    }
}
