using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Address.Business.Status
{

    public enum  UserRoles: int
    {
        /// <summary>
        /// Trạng thái user bi khoa
        /// </summary>
        Disable = 1,
        /// <summary>
        /// Trạng thái user binh thuong
        /// </summary>
        Normal = 2,
        /// <summary>
        /// Trạng thái user co quyen review mot dia diem
        /// </summary>
        Reviewer = 4,
        /// <summary>
        /// Trạng thái user la admin
        /// </summary>
        Admin = 8
    }

}
