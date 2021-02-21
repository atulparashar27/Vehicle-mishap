using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class RolesDetails
    {
        public int? RoleId { get; set; }
        public string AccessType { get; set; }
    }
    public class UserRolesModal : RolesDetails
    {
        public string RoleName { get; set; }
        public string RoleDesc { get; set; }
    }

    public class UpdateRolesModal
    {
        public string UidNo { get; set; }
        public List<RolesDetails> RolesDetailsList { get; set; }
    }
}
