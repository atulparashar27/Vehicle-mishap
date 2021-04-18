using ODPortalWebDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Constants
{
    public static class RawSQL
    {
        public static string CheckAuth(string userName, string passWord)
        {
            return $"SELECT Name_Full, Date_Birth, Roll_No, UID_No " +
                    $"FROM BranchMaster " +
                    $"WHERE UID_No='{userName}' " +
                    $"AND Status='CR' " ;
        }

        internal static string GetAllUserPassword(string userName)
        {
            return $"SELECT UserName, Password FROM Login_Details WHERE UserName = '{userName}'";
        }

        internal static string GetAllUserRoles(string userName)
        {
            return $"SELECT * FROM Users_Roles where UserId = '{userName}'";
        }

        public static string GetAllActCode()
        {
            return $"SELECT Act_cd as ActId, Act_Name as ActName FROM ActivityCode WHERE DeleteInd is null";
        }

        public static string GetSingleActivity(string actCode, DateTime actDate)
        {
            return $"SELECT Act_cd as ActId, Act_Name as ActName FROM ActivityCode WHERE DeleteInd is null and Act_cd = '{actCode}'";
        }

        public static string GetAllPeopleList(string status)
        {
            return $"SELECT * FROM BranchMaster WHERE Status='{status}'";
        }

        public static string GetSavedAttendance(string actCode, DateTime actDate)
        {
            return $"SELECT Gender, Name_Full, INI_JIG_NON, Sant_su, UID_No, Act_Date, attend.Roll_No as Roll_No " +
                    $"FROM Act2018 attend, BranchMaster branch " +
                    $"WHERE attend.Roll_NO = branch.Roll_NO " +
                    $"AND attend.Act_cd='{actCode}' " +
                    $"AND attend.Act_Date=#{actDate}# ";
        }

        public static string GetSaveVisitorsAttendance(string actCode, DateTime actDate)
        {
            return $"SELECT VisitorName, Act_cd, Act_date, Branch_Visitor, Gender, Initiated, Age " +
                    $"FROM VisitorOD " +
                    $"WHERE Act_cd='{actCode}' " +
                    $"AND Act_date=#{actDate}# ";
        }

        internal static string ReportsBranchPeopleAttendance(BranchPeopleAttendance branchPeopleAttendance)
        {
            string allActCode = string.Join("' , '", branchPeopleAttendance.ActivityCode);
            var startAge = Convert.ToDouble(branchPeopleAttendance.StartAge);
            var endAge = Convert.ToDouble(branchPeopleAttendance.EndAge);
            return $"SELECT code.Act_cd, code.Act_Name as Act_Name, mstBr.UID_No as UID_No, " +
                    $"mstBr.Roll_NO as Roll_NO, mstBr.Name_Full as Name_Full, mstBr.Mobile, " +
                    $"mstBr.INI_JIG_NON as INI_JIG_NON, attend.Act_Date as Act_Date, " +
                    $"count(mstBr.Roll_NO) as AttendanceCount " +
                    $"FROM BranchMaster mstBr, Act2018 attend, ActivityCode code " +
                    $"WHERE mstBr.Roll_NO = attend.Roll_NO " +
                    $"AND attend.Act_cd = code.Act_cd " +
                    $"AND attend.Act_cd in ('{allActCode}') " +
                    $"AND mstBr.Age >= {startAge} " +
                    $"AND mstBr.Age <= {endAge} " +
                    $"AND attend.Act_Date >= #{branchPeopleAttendance.StartDate}# " +
                    $"AND attend.Act_Date <= #{branchPeopleAttendance.EndDate}# " +
                    $"GROUP BY code.Act_Name, mstBr.UID_No, mstBr.Roll_NO, mstBr.Name_Full, " +
                    $"mstBr.INI_JIG_NON, attend.Act_Date, code.Act_cd, mstBr.Mobile " +
                    $"ORDER BY mstBr.Name_Full" ;
        }


        internal static string ReportsBranchIndividualAttendance(BranchPeopleAttendance branchPeopleAttendance)
        {
            var rollNo = Convert.ToDouble(branchPeopleAttendance.RollNo);
            return $"SELECT code.Act_Name as Act_Name, mstBr.UID_No as UID_No, " +
                    $"mstBr.Roll_NO as Roll_NO, mstBr.Name_Full as Name_Full, " +
                    $"mstBr.INI_JIG_NON as INI_JIG_NON, attend.Act_Date as Act_Date, " +
                    $"count(mstBr.Roll_NO) as AttendanceCount " +
                    $"FROM BranchMaster mstBr, Act2018 attend, ActivityCode code " +
                    $"WHERE mstBr.Roll_NO = attend.Roll_NO " +
                    $"AND attend.Act_cd = code.Act_cd " +
                    $"AND attend.Act_cd = ('{branchPeopleAttendance.SingleActivityCode}') " +
                    $"AND attend.Act_Date >= #{branchPeopleAttendance.StartDate}# " +
                    $"AND attend.Act_Date <= #{branchPeopleAttendance.EndDate}# " +
                    $"AND (mstBr.Roll_No = {rollNo}) " +
                    $"GROUP BY code.Act_Name, mstBr.UID_No, mstBr.Roll_NO, mstBr.Name_Full, " +
                    $"mstBr.INI_JIG_NON, attend.Act_Date ";
        }

        internal static string ReportsBranchPeopleSummary(BranchPeopleSummaryModel branchPeopleAttendance)
        {
            string allActCode = string.Join("' , '", branchPeopleAttendance.ActivityCode);
            return $"SELECT code.Act_cd, code.Act_Name as Act_Name, mstBr.UID_No as UID_No, " +
                    $"mstBr.Roll_NO as Roll_NO, mstBr.Name_Full as Name_Full, mstBr.Mobile, " +
                    $"mstBr.INI_JIG_NON as INI_JIG_NON, attend.Act_Date as Act_Date, " +
                    $"count(mstBr.Roll_NO) as AttendanceCount, mstBr.SANT_SU " +
                    $"FROM BranchMaster mstBr, Act2018 attend, ActivityCode code " +
                    $"WHERE mstBr.Roll_NO = attend.Roll_NO " +
                    $"AND attend.Act_cd = code.Act_cd " +
                    $"AND attend.Act_cd in ('{allActCode}') " +
                    $"AND attend.Act_Date >= #{branchPeopleAttendance.StartDate}# " +
                    $"AND attend.Act_Date <= #{branchPeopleAttendance.EndDate}# " +
                    $"GROUP BY code.Act_Name, mstBr.UID_No, mstBr.Roll_NO, mstBr.Name_Full, " +
                    $"mstBr.INI_JIG_NON, attend.Act_Date, code.Act_cd, mstBr.Mobile, mstBr.SANT_SU " +
                    $"ORDER BY mstBr.Name_Full";
        }

        internal static string ReportsBranchVisitorsPeopleSummary(BranchPeopleSummaryModel branchPeopleAttendance)
        {
            string allActCode = string.Join("' , '", branchPeopleAttendance.ActivityCode);
            return $"SELECT code.Act_cd as Act_cd, code.Act_Name as Act_Name, attend.Initiated as Initiated ,    " +
                    $" attend.Act_Date as Act_Date " +
                    $"FROM VisitorOD attend inner join ActivityCode code " +
                    $"on attend.Act_cd = code.Act_cd " +
                    $"WHERE attend.Act_cd in ('{allActCode}') " +
                    $"AND attend.Act_Date >= #{branchPeopleAttendance.StartDate}# " +
                    $"AND attend.Act_Date <= #{branchPeopleAttendance.EndDate}# ";

        }

        internal static string GetProfileData(string uidNo, string rollNo)
        {
            var doubleRollNo = Convert.ToDouble(rollNo);
            if (!string.IsNullOrWhiteSpace(uidNo))
            {
                return $"SELECT mstBr.Title,mstBr.Name_Full,mstBr.Date_Birth,mstBr.Gender, " +
                        $"mstBr.Caste,mstBr.Marital_Status,mstBr.Mobile,mstBr.Mobile1, mstBr.Email1, " +
                        $"mstBr.Email2,mstBr.Organization, mstBr.Place,mstBr.Designation, " +
                        $"mstBr.Occupation,mstBr.Qualification, mstBr.Roll_NO, mstBr.UID_No," +
                        $"mstBr.Title_1, mstBr.Grid_Coord,mstBr.Rem_Bran_mast, " +
                        $"mstBr.Off_ph1, mstBr.Off_ph2, mstBr.Title_1, " +
                        $"mstBr.Nationality, mstBr.AadharNo, mstBr.PanCardNo, " +
                        $"mstRs.Add1,mstRs.Add2,mstRs.Add3,mstRs.City,mstRs.Pin_cd, " +
                        $"mstRs.EmergencyContact, mstRs.EmergencyContactNo " +
                        $"FROM BranchMaster mstBr, ResidenceMaster mstRs " +
                        $"WHERE mstBr.Residence_cd = mstRs.Residence_cd " +
                        $"AND mstBr.Uid_No = '{uidNo}' " +
                        $"AND mstBr.status = 'CR' ";
            }
            else if (!string.IsNullOrWhiteSpace(rollNo))
            {
                return $"SELECT Title,Name_Full,Date_Birth,Gender,Caste,Marital_Status, " +
                        $"Nationality,AadharNo,PanCardNo " +
                        $"FROM BranchMaster WHERE Roll_NO = '{doubleRollNo}' ";
            }
            else
            {
                throw new CustomException("This user is not valid");
            }
        }

        internal static string GetProfileBrInfo(double rollNo)
        {
            return $"SELECT DOI_1, DOI_2 " +
                    $"FROM InitiatedMembers " +
                    $"WHERE Roll_No = {rollNo} ";
        }

        internal static string GetFamilyCode(string uidNo)
        {
            return $"SELECT Family_cd FROM BranchMaster where Uid_No = '{uidNo}'";
        }

        internal static string GetAllFamilyPeople(double? cd)
        {
            return $"SELECT mstBr.Name_Full, mstBr.Uid_No, mstBr.Reelation, mstBr.INI_JIG_NON, mstBr.Roll_No " +
                    $"FROM BranchMaster mstBr " +
                    $"WHERE Family_cd = {cd} ";
        }

        internal static string GetUserRolesData()
        {
            return "SELECT * FROM Roles";
        }

        internal static string GetUserIndividualRoles(string userName)
        {
            return $"SELECT urs.RoleId as RoleId, RoleName, RoleDesc, AccessType " +
                    $"FROM Users_Roles urs inner join Roles rs " +
                    $"on urs.RoleId = rs.RoleId " +
                    $"WHERE urs.UserId = '{userName}'";
        }

        internal static string GetLocalityLists()
        {
            return $"SELECT LOCA_CD as LocalityId, Locality " +
                    $"FROM LocalityCode ";
        }

        internal static string GetLocalityPeople(int localityId)
        {
            return $"SELECT UID_No as UIDNo, Name_Full as FullName, Mobile as MobileNum, Mobile1 as MobileNum2, Family_cd as FamilyCode," +
                    $" LOCA_CD as LocalityId, Grid_Coord as GridCoord " +
                    $"FROM BranchMaster " +
                    $"Where LOCA_CD like ('{localityId}') and status='CR' " +
                    $"ORDER BY Family_cd" ;
        }
    }
}
