using System;

namespace KintoneDeployTool.DataAccess.AutoSetter
{
    /// <summary>
    /// 作成系情報カラム値自動設定クラス
    /// </summary>
    public class CreatedAutoSetter : AutoSetterBase
    {
        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="entity"></param>
        internal override void SetValues(dynamic entity)
        {
            var now = Clock.Now;
            entity.CreatedAt = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second).AddMilliseconds(now.Millisecond);
        }
    }
}
