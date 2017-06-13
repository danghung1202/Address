using System.Web;
using System.Web.Optimization;

namespace Address.View
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            
            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
                        "~/Scripts/gs*",
                        "~/Scripts/jquery.ba-resize.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/addressjs").Include(
                        "~/Scripts/address/gs.*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/site.css", 
                "~/Content/address.css"));
        }
    }
}