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
    public class Address
    {
        [DataMember]
        public string A_ID { get; set; }
        [DataMember]
        public string A_Center { get; set; }
        [DataMember]
        public string A_Border { get; set; }
        [DataMember]
        public List<string> Points { get; set; }
        [DataMember]
        public string A_ParentID { get; set; }
        [DataMember]
        public int A_Level { get; set; }
        [DataMember]
        public string A_Name { get; set; }
        [DataMember]
        public string A_Description { get; set; }
        [DataMember]
        public string A_CreatedByUser { get; set; }
        //[DataMember]
        public DateTime A_CreatedOnDate { get; set; }
        [DataMember]
        public string A_ReviewedByUser { get; set; }
        //[DataMember]
        public DateTime A_ReviewedOnDate { get; set; }
        [DataMember]
        public int A_Status { get; set; }
        //[DataMember]
        public User A_User { get; set; }
        //[DataMember]
        public List<History> A_History { get; set; }
        [DataMember]
        public List<Address> A_Children { get; set; }
    }
}
