using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class MiscModal
    {
        public class LocalityList
        {
            public double LocalityId { get; set; }
            public string Locality { get; set; }
        }
        public class LocalityPeople
        {
            public string UIDNo { get; set; }
            public string FullName { get; set; }
            public string MobileNum { get; set; }
            public string MobileNum2 { get; set; }
            public double? FamilyCode { get; set; }
            public double LocalityId { get; set; }
            public string GridCoord { get; set; }
            public bool IsGridCoord { get; set; }
        }
    }
}
