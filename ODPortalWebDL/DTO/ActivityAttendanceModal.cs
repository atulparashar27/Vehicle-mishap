using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class ActivityAttendanceModal
    {
        public string UidNo { get; set; }
        public string Name { get; set; }
        public string IniJigStatus { get; set; }
        public int RollNo { get; internal set; }
        public int? FamilyCode { get; internal set; }
    }
}
