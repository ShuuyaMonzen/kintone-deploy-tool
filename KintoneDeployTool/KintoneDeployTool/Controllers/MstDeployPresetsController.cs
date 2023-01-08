using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using KintoneDeployTool.DataAccess;
using KintoneDeployTool.DataAccess.DomainModel;
using KintoneDeployTool.DataAccess.Const;

namespace KintoneDeployTool.Controllers
{
    public class MstDeployPresetsController : Controller
    {
        private readonly AppInnerDBContext _context;

        public MstDeployPresetsController(AppInnerDBContext context)
        {
            _context = context;
        }

        // GET: MstDeployPresets
        public async Task<IActionResult> Index()
        {
            return View(await _context.MstDeployPreset.ToListAsync());
        }

        // GET: MstDeployPresets/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstDeployPreset = await _context.MstDeployPreset
                .Include(p => p.MstDeployFromToInfos)
                .Where(p => p.MstDeployPresetId == id)
                .FirstOrDefaultAsync();
            if (mstDeployPreset == null)
            {
                return NotFound();
            }
            SetSelectList();

            return View(mstDeployPreset);
        }

        // GET: MstDeployPresets/Create
        public IActionResult Create()
        {
            SetSelectList();
            return View();
        }

        // POST: MstDeployPresets/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MstDeployPresetId,PresetName,LatestActionDateTime,CreatedAt,UpdatedAt,MstDeployFromToInfos")] MstDeployPreset mstDeployPreset)
        {
            if (ModelState.IsValid)
            {
                if (mstDeployPreset.MstDeployFromToInfos != null && mstDeployPreset.MstDeployFromToInfos.Any()) {
                    foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
                    {
                        mstDeployFromToInfo.MstDeployFromToInfoId = 0;
                    }
                }

                _context.Add(mstDeployPreset);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(mstDeployPreset);
        }

        // GET: MstDeployPresets/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            SetSelectList();
            var mstDeployPreset = await _context.MstDeployPreset
                .Include(p => p.MstDeployFromToInfos)
                .ThenInclude(x => x.DeployFromMstKintoneApp)
                .Include(p => p.MstDeployFromToInfos)
                .ThenInclude(x => x.DeployToMstKintoneApp)
                .Where(p => p.MstDeployPresetId == id)
                .FirstOrDefaultAsync();
            if (mstDeployPreset == null)
            {
                return NotFound();
            }
            return View(mstDeployPreset);
        }

        // POST: MstDeployPresets/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MstDeployPresetId,PresetName,LatestActionDateTime,CreatedAt,UpdatedAt,MstDeployFromToInfos")] MstDeployPreset mstDeployPreset)
        {
            if (id != mstDeployPreset.MstDeployPresetId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    if (mstDeployPreset.MstDeployFromToInfos != null && mstDeployPreset.MstDeployFromToInfos.Any())
                    {
                        foreach (var mstDeployFromToInfo in mstDeployPreset
                        .MstDeployFromToInfos
                        .Where(x => x.MstDeployFromToInfoId == CodeConst.ADD_TARGET_ID_VALUE))
                        {
                            mstDeployFromToInfo.MstDeployFromToInfoId = 0;
                            _context.Add(mstDeployFromToInfo);
                        }
                    }
                       
                    _context.Update(mstDeployPreset);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MstDeployPresetExists(mstDeployPreset.MstDeployPresetId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(mstDeployPreset);
        }

        // GET: MstDeployPresets/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            SetSelectList();
            var mstDeployPreset = await _context.MstDeployPreset
                .Include(p => p.MstDeployFromToInfos)
                .Where(p => p.MstDeployPresetId == id)
                .FirstOrDefaultAsync();
            if (mstDeployPreset == null)
            {
                return NotFound();
            }

            return View(mstDeployPreset);
        }

        // POST: MstDeployPresets/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var mstDeployPreset = await _context.MstDeployPreset
                .Include(p => p.MstDeployFromToInfos)
                .Where(p => p.MstDeployPresetId == id)
                .FirstOrDefaultAsync();

            foreach(var detail in mstDeployPreset.MstDeployFromToInfos)
            {
                _context.MstDeployFromToInfo.Remove(detail);
            }
            await _context.SaveChangesAsync();

            mstDeployPreset.MstKintoneAppMappingID = null;
            mstDeployPreset.MstKintoneAppMapping = null;
            await _context.SaveChangesAsync();

            _context.MstDeployPreset.Remove(mstDeployPreset);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MstDeployPresetExists(int id)
        {
            return _context.MstDeployPreset.Any(e => e.MstDeployPresetId == id);
        }

        public IActionResult AddDetailsOnCreate([Bind("MstDeployPresetId,PresetName,LatestActionDateTime,CreatedAt,UpdatedAt,MstDeployFromToInfos")] MstDeployPreset mstDeployPreset)
        {
            SetSelectList();
            AddDetailsProc(mstDeployPreset);
            return View("Create", mstDeployPreset);
        }

        public IActionResult AddDetailsOnEdit([Bind("MstDeployPresetId,PresetName,LatestActionDateTime,CreatedAt,UpdatedAt,MstDeployFromToInfos")] MstDeployPreset mstDeployPreset)
        {
            SetSelectList();
            AddDetailsProc(mstDeployPreset);
            return View("Edit", mstDeployPreset);
        }

        private void AddDetailsProc(MstDeployPreset mstDeployPreset)
        {
            if (mstDeployPreset.MstDeployFromToInfos == null)
            {
                mstDeployPreset.MstDeployFromToInfos = new List<MstDeployFromToInfo>();
            }

            mstDeployPreset.MstDeployFromToInfos.Add(new MstDeployFromToInfo()
            {
                MstDeployPresetId = mstDeployPreset.MstDeployPresetId,
                MstDeployFromToInfoId = CodeConst.ADD_TARGET_ID_VALUE
            });
        }

        private void SetSelectList()
        {
            var mstKintoneApps = _context.MstKintoneApp
                .Include(x => x.MstKintoneEnviroment)
                .ToList();
            List<object> mstKintoneAppsNewList = new List<object>();
            foreach (var mstKintoneApp in mstKintoneApps)
                mstKintoneAppsNewList.Add(new
                {
                    MstKintoneAppID = mstKintoneApp.MstKintoneAppID,
                    AppName = ((mstKintoneApp.IsDeleted) ? ("(削除済) ") : "") +
                            "サブドメイン:" + mstKintoneApp.MstKintoneEnviroment.SubDomain +
                            " アプリID:" + mstKintoneApp.AppId +
                            " アプリ名:" + mstKintoneApp.AppName
                });

            ViewData["DeployFromMstKintoneAppID"] = new SelectList(mstKintoneAppsNewList, "MstKintoneAppID", "AppName");
            ViewData["DeployToMstKintoneAppID"] = new SelectList(mstKintoneAppsNewList, "MstKintoneAppID", "AppName");
        }
    }
}
