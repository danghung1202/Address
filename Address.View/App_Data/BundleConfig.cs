using System.Web;
using System.Web.Optimization;

namespace Address.View
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery/core/v1.6.4/jquery-1.6.4.min.js",
                    "~/Scripts/jquery/UI/v1.8.16/jquery-ui-1.8.16.custom.min.js",
                    "~/Scripts/jquery.ba-resize.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/gsmapjs").Include(
                "~/Scripts/gs*"));

            bundles.Add(new ScriptBundle("~/bundles/addressjs").Include(
                        "~/Scripts/address/gs.*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Scripts/jquery/UI/v1.8.16/css/redmond/jquery-ui-1.8.16.custom.css",
                "~/Content/site.css",
                "~/Content/address.css"));
        }
    }
}