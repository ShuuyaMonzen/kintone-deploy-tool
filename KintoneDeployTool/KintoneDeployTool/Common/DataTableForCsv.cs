using System.Collections.Generic;

namespace KintoneDeployTool.Common
{
    public class DataTableForCsv
    {
        public class DataRow
        {
            public List<string> Cells { get; } = new List<string>();
        }

        public List<string> Columns { get; } = new List<string>();

        public List<DataRow> Rows { get; } = new List<DataRow>();

        public DataRow NewRow()
        {
            return new DataRow();
        }

    }
}
