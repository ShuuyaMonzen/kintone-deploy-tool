using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace KintoneDeployTool.Utils.Transaction
{
    /// <summary>
    /// トランザクションスコープビルダー
    /// </summary>
    public static class TransactionScopeBuilder
    {
        /// <summary>
        /// トランザクション作成
        /// </summary>
        /// <returns>トランザクションスコープ</returns>
        public static TransactionScope Create()
        {
            if (System.Transactions.Transaction.Current != null)
            {
                return new TransactionScope();
            }

            var options = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted,
                Timeout = TransactionManager.DefaultTimeout
            };

            return new TransactionScope(TransactionScopeOption.Required, options);
        }
    }
}
