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
        public string DateOfBirth { get; set; }
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

    }
    public class QualificationInfo
    {

    }
    public class PersonBrInfo
    {

    }
}
