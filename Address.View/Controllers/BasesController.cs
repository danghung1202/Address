using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Address.Business;
using Address.Business.Entities;
using Address.Business.Repositories;
using Address.Business.Status;

namespace Address.View.Controllers
{
    public class BasesController : Controller
    {
        protected Address.Business.Entities.User user = null;

        protected AddressRepository _addressRes = null;
        protected HistoryRepository _historyRes = null;
        protected UserRepository _userRes = null;

        public BasesController ()
        {
            _addressRes = new AddressRepository();
            _historyRes = new HistoryRepository();
            _userRes = new UserRepository();
            user = new User { U_FullName = "Đặng Việt Hùng", U_User = "dangviethung" };
        }

    }
}
