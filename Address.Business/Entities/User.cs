using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Runtime.Serialization;

namespace Address.Business.Entities
{
    [DataContract]
    public class User
    {
        [DataMember]
        public string U_User { get; set; }
        [DataMember]
        public string U_FullName { get; set; }
        [DataMember]
        public DateTime U_Birthday { get; set; }
        [DataMember]
        public byte U_Gender { get; set; }
        [DataMember]
        public string U_Email { get; set; }
        [DataMember]
        public DateTime U_CreatedOnDate { get; set; }
        [DataMember]
        public byte U_Role { get; set; }
        [DataMember]
        public List<Address> U_Address { get; set; }
        [DataMember]
        public List<History> U_History { get; set; }

    }
}
