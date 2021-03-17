using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.DTO
{
    public class UserProfileModal
    {
        public ProfileInfo ProfileList { get; set; }
        public ContactInfo ContactInfo { get; set; }
        public CompanyInfo CompanyInfo { get; set; }
        public QualificationInfo QualificationInfo { get; set; }
        public PersonBrInfo PersonBrInfo { get; set; }
    }
    public class ProfileInfo
    {
        public string Title { get; set; }
        public string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Caste { get; set; }
        public string MaritalStatus { get; set; }
        public string Nationality { get; set; }
        public string AadharNo { get; set; }
        public string PanNo { get; set; }
    }
    public class ContactInfo
    {
        public string ResidenceAddr { get; set; }
        public string City { get; set; }
        public string Pincode { get; set; }
        public string MobileNo1 { get; set; }
        public string MobileNo2 { get; set; }
        public string EmergencyContact { get; set; }
        public string EmergencyContactNo { get; set; }
        public string Email1 { get; set; }
        public string Email2 { get; set; }
    }
    public class CompanyInfo
    {
        public string OrgName { get; set; }
        public string OrgAddress { get; set; }
        public string Designation { get; set; }
        public string Occupation { get; set; }
        public string OfficePh1 { get; set; }
        public string OfficePh2 { get; set; }
    }
    public class QualificationInfo
    {
        public string Qualification { get; set; }
    }
    public class PersonBrInfo
    {
        public int RollNo { get; set; }
        public string UidNo { get; set; }
        public DateTime? DateOfIni1 { get; set; }
        public DateTime? DateOfIni2 { get; set; }
        public string BrTitle { get; set; }
        public string GridCoord { get; set; }

    }

    public class UserFamilyModal
    {
        public string UidNo { get; set; }
        public string Name { get; set; }
        public string IniJigStatus { get; set; }
        public string Relation { get; set; }
        public int RollNo { get; internal set; }
    }
}
