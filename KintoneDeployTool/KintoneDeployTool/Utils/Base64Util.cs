using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KintoneDeployTool.Utils
{
    public static class Base64Util
    {
        private static Encoding enc = Encoding.GetEncoding("UTF-8");
        
        public static string Encode(string str)
        {
            return Convert.ToBase64String(enc.GetBytes(str));
        }

        public static string Decode(string str)
        {
            return enc.GetString(Convert.FromBase64String(str));
        }
    }
}
