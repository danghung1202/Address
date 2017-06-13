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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
    [ServiceContract]
    public interface IAddressService
    {
        /// <summary>
        /// Lay dia chi cua mot dia diem tren ban do
        /// </summary>
        /// <param name="resource">Đối tượng tài nguyên được cập nhật</param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        List<string> Address_GetAddressOfLocation(string A_Center);

        /// <summary>
        /// Cập nhật thông tin của tài liệu trong phòng ban.
        /// </summary>
        /// <param name="resource">Đối tượng tài nguyên được cập nhật</param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        Address.Business.Entities.Address Address_Get(string id);

    }
}
