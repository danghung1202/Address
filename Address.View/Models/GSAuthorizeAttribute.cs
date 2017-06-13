using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Profiles.Core.App;
using Profiles.Core.Protocol;

namespace Address.View.Models
{
    public class GSAuthorizeAttribute : FilterAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationContext filterContext)
        {
            if (!filterContext.HttpContext.Request.IsAuthenticated || (filterContext.HttpContext.User.GetUserName() == null))
            {
                filterContext.HttpContext.Response.Redirect("/login.ashx");
            }
        }
    }
}