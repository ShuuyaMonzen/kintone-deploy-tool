using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KintoneDeployTool.Common
{
    public class AppMapInfo
    {
        public class AppMap
        {
            public string FromAppName { get; set; }
            public int FromAppId { get; set; }

            public string ToAppName { get; set; }
            public int ToAppId { get; set; }
        }

        public List<AppMap> Mapping { get; }
            = new List<AppMap>();

    }
}
