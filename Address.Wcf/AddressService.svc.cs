using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using Address.Business.Entities;
using Address.Business.Repositories;

namespace Address.Wcf
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    public class AddressService : IAddressService
    {

        private AddressRepository _addressRes;
        private HistoryRepository _historyRes;
        private UserRepository _userRes;

        public AddressService(): this(new AddressRepository(), new HistoryRepository(), new UserRepository())
        {

        }

        public AddressService(AddressRepository addressRes, HistoryRepository historyRes, UserRepository userRes)
        {
            this._addressRes = addressRes;
            this._historyRes = historyRes;
            this._userRes = userRes;
        }

        
        /// <summary>
        /// Cập nhật thông tin của tài liệu trong phòng ban.
        /// </summary>
        /// <param name="resource">Đối tượng tài nguyên được cập nhật</param>
        /// <returns></returns>
        public List<string> Address_GetAddressOfLocation(string A_Center)
        {
            return _addressRes.Address_GetAddressOfLocation(A_Center);
        }
    }
}
