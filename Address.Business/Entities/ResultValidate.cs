using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Address.Business.Entities
{
    public class ResultValidate
    {
        public int DuongBaoHopLe { get; set; }
        public int DiemNamTrongDuongBao { get; set; }
        public int DuongBaoNamTrongDuongBao { get; set; }

        public List<Address> DiaDanhTrung { get; set; }
    }
}
