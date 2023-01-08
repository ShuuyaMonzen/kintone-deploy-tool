using KintoneDeployTool.Utils.Time;

namespace KintoneDeployTool.DataAccess.AutoSetter
{
    /// <summary>
    /// 自動設定ベースクラス
    /// </summary>
    public abstract class AutoSetterBase
    {
        /// <summary>日時関連のオブジェクトを取得するクラス</summary>
        internal Clock Clock { get; set; } = Clock.Instance;

        /// <summary>
        /// 値を設定する。
        /// </summary>
        internal abstract void SetValues(dynamic entity);
    }
}
