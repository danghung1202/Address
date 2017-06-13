using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Address.Business.Entities;

namespace Address.Business.Repositories
{
    public class UserRepository : BaseRepository
    {
        /// <summary>
        /// User sửa một địa chỉ sẽ thêm bản ghi address vào bảng lịch sử nếu user là admin or cộng tác viên thì bản ghi này được tin tưởng và restore luôn vào địa chỉ chính thức đồng thời review luôn
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public bool User_Add(User user)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@U_User", user.U_User);
            _dbAdapter.AddParam(SqlDbType.NVarChar, "@U_FullName", user.U_FullName);
            _dbAdapter.AddParam(SqlDbType.DateTime2, "@U_Birthday", user.U_Birthday);
            _dbAdapter.AddParam(SqlDbType.Bit, "@U_Gender", user.U_Gender);
            _dbAdapter.AddParam(SqlDbType.TinyInt, "@U_Role", user.U_Role);

            return _dbAdapter.Insert("User_Add");
        }

        /// <summary>
        /// User sửa một địa chỉ sẽ thêm bản ghi address vào bảng lịch sử nếu user là admin or cộng tác viên thì bản ghi này được tin tưởng và restore luôn vào địa chỉ chính thức đồng thời review luôn
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Entities.User User_GetDetail(string U_User)
        {
            _dbAdapter.ResetParams();
            _dbAdapter.AddParam(SqlDbType.VarChar, "@U_User", U_User);

            Entities.User user = null;
            SqlDataReader reader = _dbAdapter.Select("User_GetDetail");
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    user = new Entities.User();
                    user.U_User = reader["U_User"].ToString();
                    user.U_FullName = reader["U_FullName"] != DBNull.Value ? (string)reader["U_FullName"] : string.Empty;
                    user.U_Gender = byte.Parse(reader["U_Gender"] != DBNull.Value ? reader["U_Gender"].ToString() : "0");
                    user.U_Email = reader["U_Email"] != DBNull.Value ? (string)reader["U_Email"] : string.Empty;
                    user.U_Birthday =  reader["U_Birthday"] != DBNull.Value ? DateTime.Parse(reader["U_Birthday"].ToString()) : DateTime.MinValue;
                    user.U_Role = byte.Parse(reader["U_Role"].ToString());
                }
            }
            reader.Close();
            return user;
        }
    }
}
