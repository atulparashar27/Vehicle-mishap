using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class GetUserLoginObject : Credentials
    {
        public int RollNo { get; set; }
        public string UidNo { get; set; }
        public List<SecurityObjects> RolesDetailsList { get; set; }
    }

    public class SecurityObjects
    {
        public int RoleId { get; set; }
        public string AccessType { get; set; }
    }
}
