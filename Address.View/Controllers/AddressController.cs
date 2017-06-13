using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Address.Business;
using Address.Business.Entities;
using Address.Business.Repositories;
using Address.Business.Status;
using GoldenSoft.SSO.Core;

namespace Address.View.Controllers
{
    public class AddressController : BasesController
    {
        public AddressController() : base()
        {
            
        }

        public ActionResult Index()
        {
            //TODO: chèn user ở đây
            if (User.Identity.IsAuthenticated)
            {
                List<History> histories = _historyRes.History_GetAddressOfUser(User.Identity.Name, 1, 15);
                ViewBag.Histories = histories;
            }

            List<History> anewest = _historyRes.History_GetNewest(1, 15);
            ViewBag.NewestAddress = anewest;

            return View();
        }

        [HttpPost]
        public JsonResult authorize() {
            
            return Json(new { isAuthorize = true /*User.Identity.IsAuthenticated*/ });
        }

        [HttpPost]
        public JsonResult getaddress(string id)
        {
            Address.Business.Entities.Address address = _addressRes.Address_GetDetailWithChildren(id);
            return Json(address);
        }

        [HttpGet]
        [Authorize]
        public ActionResult add()
        {
            //TODO: Kiem tra dang nhap
            return PartialView("dialog/add");
        }

        [HttpPost]
        [Authorize]
        public ActionResult add(string aname, string adesc, string acenter, string aborder, int alevel, string aparent)
        {
            //TODO: Kiem tra dang nhap
            Address.Business.Entities.Address address = new Business.Entities.Address
            {
                A_ID = string.Empty,
                A_Name = aname,
                A_Description = adesc,
                A_Border = aborder,
                A_Center = acenter,
                A_Level = alevel,
                A_ParentID = aparent,
                A_CreatedByUser = User.Identity.Name
            };

            //TODO: Validate đường bao o day

            ResultValidate result = _addressRes.Address_AddValidate(address);
            bool b = false;
            if (result.DiemNamTrongDuongBao == 1 && result.DuongBaoHopLe == 1 && result.DuongBaoNamTrongDuongBao == 1 && result.DiaDanhTrung.Count == 0 ) { 
                b = _addressRes.Address_Add(address);
            }
            return PartialView("dialog/result_validate_address",result);
        }

        [HttpGet]
        public ActionResult detail(string id)
        {
            Address.Business.Entities.Address address = _addressRes.Address_GetDetailWithHistory(id, User.Identity.Name);
            return PartialView("dialog/detail", address);
        }

        [HttpPost]
        public JsonResult historydetail(string id)
        {
            Address.Business.Entities.History history = _historyRes.History_GetDetail(id);
            
            return Json(history);
        }

        /// <summary>
        /// lấy lịch sử cập nhật của một user
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public ActionResult gethistories(int p)
        {
            //TODO: Kiem tra dang nhap
            List<History> histories = _historyRes.History_GetAddressOfUser(User.Identity.Name, p, 15);
            return PartialView("../history/index",histories);
        }

        /// <summary>
        /// lấy ra các thao tác mới nhất
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult newest(int p)
        {
            //TODO: Kiem tra dang nhap
            List<History> histories = _historyRes.History_GetNewest(p, 15);
            return PartialView("../history/index", histories);
        }

        [HttpPost]
        [Authorize]
        public ActionResult update(string aid, string aname, string adesc, string acenter, string aborder, int alevel, string aparent)
        {
            //TODO: Kiem tra dang nhap
            Address.Business.Entities.Address address = new Business.Entities.Address
            {
                A_ID = aid,
                A_Name = aname,
                A_Description = adesc,
                A_Border = aborder,
                A_Center = acenter,
                A_Level = alevel,
                A_ParentID = aparent,
                A_CreatedByUser = User.Identity.Name
            };

            Address.Business.Entities.History history = new Business.Entities.History
            {
                H_AddressID = aid,
                H_Name = aname,
                H_Description = adesc,
                H_Border = aborder,
                H_Center = acenter,
                H_Level = alevel,
                H_ParentID = aparent,
                H_CreatedByUser = User.Identity.Name
                ,H_ActionDetail = string.Empty
            };
            //TODO: Validate đường bao o day

            ResultValidate result = _addressRes.Address_AddValidate(address);
            bool b = false;
            if (result.DiemNamTrongDuongBao == 1 && result.DuongBaoHopLe == 1 && result.DuongBaoNamTrongDuongBao == 1 && result.DiaDanhTrung.Count == 0)
            {
                b = _historyRes.History_AddAddress(history);
            }
            return PartialView("dialog/result_validate_address", result);
        }

        [HttpPost]
        [Authorize]
        public JsonResult delete(string aid, string reasons)
        {
            bool b = _addressRes.Address_Delete(aid, User.Identity.Name, reasons);

            Address.Business.Entities.User u = _userRes.User_GetDetail(User.Identity.Name);
            return Json(new { success = b, urole = u.U_Role });
        }

        [HttpPost]
        [Authorize]
        public JsonResult restore(string hid)
        {
            bool b = _addressRes.Address_RestoreFromHistory(hid, User.Identity.Name);
            return Json(new { success = b});
        }

        [HttpPost]
        [Authorize]
        public JsonResult exists(string pid, int level, string center)
        {
            List<Address.Business.Entities.Address> addresses = _addressRes.Address_CheckExists(pid, level,center);
            return Json(addresses);
        }

        public ActionResult about()
        {

            return View();
        }
    }
}
