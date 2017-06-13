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
    public class History
    {
        [DataMember]
        public string H_ID { get; set; }
        [DataMember]
        public string H_AddressID { get; set; }
        [DataMember]
        public string H_Center { get; set; }
        [DataMember]
        public string H_Border { get; set; }
        [DataMember]
        public List<string> Points { get; set; }
        [DataMember]
        public string H_ParentID { get; set; }
        [DataMember]
        public int H_Level { get; set; }
        [DataMember]
        public string H_Name { get; set; }
        [DataMember]
        public string H_Description { get; set; }
        [DataMember]
        public string H_CreatedByUser { get; set; }
        [DataMember]
        public DateTime H_CreatedOnDate { get; set; }
        [DataMember]
        public DateTime H_ModifiedOnDate { get; set; }
        [DataMember]
        public string H_Action { get; set; }
        [DataMember]
        public string H_ActionDetail { get; set; }
        [DataMember]
        public int H_Rate { get; set; }
        [DataMember]
        public int H_Status { get; set; }
        [DataMember]
        public User H_User { get; set; }
        [DataMember]
        public Address H_Address { get; set; }
        [DataMember]
        public int H_IsRestore { get; set; }
        [DataMember]
        public int H_IsOwner { get; set; }

    }
}
