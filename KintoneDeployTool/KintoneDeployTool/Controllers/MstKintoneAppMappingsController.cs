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
using KintoneDeployTool.ViewModels;

namespace KintoneDeployTool.Controllers
{
    public class MstKintoneAppMappingsController : Controller
    {
        private readonly AppInnerDBContext _context;

        public MstKintoneAppMappingsController(AppInnerDBContext context)
        {
            _context = context;
        }

        // GET: MstKintoneAppMappings
        public async Task<IActionResult> Index()
        {
            var appInnerDBContext = _context.MstKintoneAppMapping.Include(m => m.MstKintoneEnviroment1).Include(m => m.MstKintoneEnviroment2);
            return View(await appInnerDBContext.ToListAsync());
        }

        // GET: MstKintoneAppMappings/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneAppMapping = await _context.MstKintoneAppMapping
                .Include(m => m.MstKintoneEnviroment1)
                .Include(m => m.MstKintoneEnviroment2)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp1)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp2)
                .Where(p => p.MstKintoneAppMappingID == id)
                .FirstOrDefaultAsync();
            if (mstKintoneAppMapping == null)
            {
                return NotFound();
            }

            SetSelectList(mstKintoneAppMapping);
            return View(mstKintoneAppMapping);
        }

        // GET: MstKintoneAppMappings/Create
        public IActionResult Create()
        {
            SetSelectList(null);
            return View();
        }

        // POST: MstKintoneAppMappings/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MstKintoneAppMappingID,MstKintoneAppMappingName,MstKintoneEnviromentID1,MstKintoneEnviromentID2,CreatedAt,UpdatedAt, MstKintoneAppMappingDetails")] MstKintoneAppMapping mstKintoneAppMapping)
        {
            Validate(mstKintoneAppMapping);

            if (!ModelState.IsValid)
            {
                SetSelectList(mstKintoneAppMapping);
                View("Create", mstKintoneAppMapping);
            }

            if (mstKintoneAppMapping.MstKintoneAppMappingDetails != null)
            {
                foreach (var MstKintoneAppMappingDetail in mstKintoneAppMapping
                .MstKintoneAppMappingDetails
                .Where(x => x.MstKintoneAppMappingDetailID == CodeConst.ADD_TARGET_ID_VALUE))
                {
                    MstKintoneAppMappingDetail.MstKintoneAppMappingDetailID = 0;
                    _context.Add(MstKintoneAppMappingDetail);
                }
            }

            _context.Add(mstKintoneAppMapping);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // GET: MstKintoneAppMappings/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneAppMapping = await _context.MstKintoneAppMapping
                .Include(m => m.MstKintoneEnviroment1)
                .Include(m => m.MstKintoneEnviroment2)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp1)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp2)
                .Where(p => p.MstKintoneAppMappingID == id)
                .FirstOrDefaultAsync();
            if (mstKintoneAppMapping == null)
            {
                return NotFound();
            }
            SetSelectList(mstKintoneAppMapping);
            return View(mstKintoneAppMapping);
        }

        // POST: MstKintoneAppMappings/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MstKintoneAppMappingID,MstKintoneAppMappingName,MstKintoneEnviromentID1,MstKintoneEnviromentID2,CreatedAt,UpdatedAt, MstKintoneAppMappingDetails")] MstKintoneAppMapping mstKintoneAppMapping)
        {
            if (id != mstKintoneAppMapping.MstKintoneAppMappingID)
            {
                return NotFound();
            }

            Validate(mstKintoneAppMapping);

            if (!ModelState.IsValid)
            {
                SetSelectList(mstKintoneAppMapping);
                View("Edit", mstKintoneAppMapping);
            }

            try
            {
                var records = await _context.MstKintoneAppMappingDetail
                            .Where(x => x.MstKintoneAppMappingID == mstKintoneAppMapping.MstKintoneAppMappingID)
                            .ToListAsync();
                _context.RemoveRange(records);

                if (mstKintoneAppMapping.MstKintoneAppMappingDetails?.Any() ?? false)
                {
                    foreach (var MstKintoneAppMappingDetail in mstKintoneAppMapping.MstKintoneAppMappingDetails)
                    {
                        if (MstKintoneAppMappingDetail.MstKintoneAppMappingDetailID == CodeConst.ADD_TARGET_ID_VALUE)
                        {
                            MstKintoneAppMappingDetail.MstKintoneAppMappingDetailID = 0;
                        }
                        await _context.AddAsync(MstKintoneAppMappingDetail);
                    }
                }

                _context.Update(mstKintoneAppMapping);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MstKintoneAppMappingExists(mstKintoneAppMapping.MstKintoneAppMappingID))
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


        // GET: MstKintoneAppMappings/CopyToMstDeployPreset/5
        public async Task<IActionResult> CopyToMstDeployPreset(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneAppMapping = await _context.MstKintoneAppMapping
                .Include(m => m.MstKintoneEnviroment1)
                .Include(m => m.MstKintoneEnviroment2)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp1)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp2)
                .Where(p => p.MstKintoneAppMappingID == id)
                .FirstOrDefaultAsync();
            if (mstKintoneAppMapping == null)
            {
                return NotFound();
            }
            SetSelectList(mstKintoneAppMapping);
            var vm = AppMappingCopyToDeployPresetViewModel.Create(mstKintoneAppMapping);

            return View(vm);
        }

        // POST: MstKintoneAppMappings/CopyToMstDeployPreset/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CopyToMstDeployPreset(int id, [Bind("MstKintoneAppMappingID,IsDeployDirection2To1,MstKintoneAppMappingName,MstKintoneEnviromentID1,MstKintoneEnviromentID2,CreatedAt,UpdatedAt, AppMappingCopyToDeployPresetDetails")] AppMappingCopyToDeployPresetViewModel viewModel)
        {
            if (id != viewModel.MstKintoneAppMappingID)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                SetSelectList(viewModel);
                View("CopyToMstDeployPreset", viewModel);
            }

            try
            {
                var mstDeployPreset = new MstDeployPreset()
                {
                    MstDeployPresetId = 0,
                    MstKintoneAppMappingID = viewModel.MstKintoneAppMappingID,
                    PresetName = viewModel.MstKintoneAppMappingName,
                    MstDeployFromToInfos = new List<MstDeployFromToInfo>()
                };

                foreach (var detail in viewModel.AppMappingCopyToDeployPresetDetails.Where(x => x.IsCopyTarget))
                {
                    var mstDeployFromToInfo = new MstDeployFromToInfo()
                    {
                        MstDeployFromToInfoId = 0,
                        MstDeployPreset = mstDeployPreset,
                        MstDeployPresetId = mstDeployPreset.MstDeployPresetId,
                        DeployFromMstKintoneAppID = viewModel.IsDeployDirection2To1 ? detail.MstKintoneAppID2 : detail.MstKintoneAppID1,
                        DeployFromMstKintoneApp = viewModel.IsDeployDirection2To1 ? detail.MstKintoneApp2 : detail.MstKintoneApp1,
                        DeployToMstKintoneAppID = viewModel.IsDeployDirection2To1 ? detail.MstKintoneAppID1 : detail.MstKintoneAppID2,
                        DeployToMstKintoneApp = viewModel.IsDeployDirection2To1 ? detail.MstKintoneApp1 : detail.MstKintoneApp2,
                    };
                    mstDeployPreset.MstDeployFromToInfos.Add(mstDeployFromToInfo);
                }

                _context.Add(mstDeployPreset);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MstKintoneAppMappingExists(viewModel.MstKintoneAppMappingID))
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


        // GET: MstKintoneAppMappings/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneAppMapping = await _context.MstKintoneAppMapping
                .Include(m => m.MstKintoneEnviroment1)
                .Include(m => m.MstKintoneEnviroment2)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp1)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp2)
                .Where(p => p.MstKintoneAppMappingID == id)
                .FirstOrDefaultAsync();
            if (mstKintoneAppMapping == null)
            {
                return NotFound();
            }

            return View(mstKintoneAppMapping);
        }

        // POST: MstKintoneAppMappings/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var mstKintoneAppMapping = await _context.MstKintoneAppMapping
                .Include(m => m.MstKintoneEnviroment1)
                .Include(m => m.MstKintoneEnviroment2)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp1)
                .Include(p => p.MstKintoneAppMappingDetails)
                .ThenInclude(x => x.MstKintoneApp2)
                .Where(p => p.MstKintoneAppMappingID == id)
                .FirstOrDefaultAsync();
            _context.MstKintoneAppMapping.Remove(mstKintoneAppMapping);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MstKintoneAppMappingExists(int id)
        {
            return _context.MstKintoneAppMapping.Any(e => e.MstKintoneAppMappingID == id);
        }

        public IActionResult AddDetailsOnCreate([Bind("MstKintoneAppMappingID,MstKintoneAppMappingName,MstKintoneEnviromentID1,MstKintoneEnviromentID2,CreatedAt,UpdatedAt, MstKintoneAppMappingDetails")] MstKintoneAppMapping mstKintoneAppMapping)
        {
            SetSelectList(mstKintoneAppMapping);
            AddDetailsProc(mstKintoneAppMapping);
            return View("Create", mstKintoneAppMapping);
        }

        public IActionResult AddDetailsOnEdit([Bind("MstKintoneAppMappingID,MstKintoneAppMappingName,MstKintoneEnviromentID1,MstKintoneEnviromentID2,CreatedAt,UpdatedAt, MstKintoneAppMappingDetails")] MstKintoneAppMapping mstKintoneAppMapping)
        {
            SetSelectList(mstKintoneAppMapping);
            AddDetailsProc(mstKintoneAppMapping);
            return View("Edit", mstKintoneAppMapping);
        }

        private void AddDetailsProc(MstKintoneAppMapping mstKintoneAppMapping)
        {
            if (mstKintoneAppMapping.MstKintoneAppMappingDetails == null)
            {
                mstKintoneAppMapping.MstKintoneAppMappingDetails = new List<MstKintoneAppMappingDetail>();
            }

            mstKintoneAppMapping.MstKintoneAppMappingDetails.Add(new MstKintoneAppMappingDetail()
            {
                MstKintoneAppMappingID = mstKintoneAppMapping.MstKintoneAppMappingID,
                MstKintoneAppMappingDetailID = CodeConst.ADD_TARGET_ID_VALUE
            });
        }

        private void Validate(MstKintoneAppMapping mstKintoneAppMapping)
        {
            //ユニークチェック
            if ((mstKintoneAppMapping.MstKintoneAppMappingDetails?.Any() ?? false) &&
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Count !=
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Select(x => x.MstKintoneAppID1).Distinct().Count())
            {
                ModelState.AddModelError("MstKintoneAppID1", "MstKintoneAppID1で重複があります。修正してください。");
            }

            if ((mstKintoneAppMapping.MstKintoneAppMappingDetails?.Any() ?? false) &&
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Count !=
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Select(x => x.MstKintoneAppID2).Distinct().Count())
            {
                ModelState.AddModelError("MstKintoneAppID2", "MstKintoneAppID2で重複があります。修正してください。");
            }
        }

        private void SetSelectList(MstKintoneAppMapping mstKintoneAppMapping)
        {
            var deployDirectionList = new List<object>()
            {
                new
                {
                    Text = "環境1 → 環境2",
                    Value = false
                },
                new
                {
                    Text = "環境2 → 環境1",
                    Value = true
                }
            };

            ViewData["DeployDirection"] = new SelectList(deployDirectionList, "Value", "Text");
            ViewData["MstKintoneEnviromentID1"] = new SelectList(_context.MstKintoneEnviroment, "MstKintoneEnviromentID", "EnviromentName");
            ViewData["MstKintoneEnviromentID2"] = new SelectList(_context.MstKintoneEnviroment, "MstKintoneEnviromentID", "EnviromentName");
            ViewData["MstKintoneAppID1"] = new SelectList(new List<object>(), "MstKintoneEnviromentID", "EnviromentName");
            ViewData["MstKintoneAppID2"] = new SelectList(new List<object>(), "MstKintoneEnviromentID", "EnviromentName");
            if (mstKintoneAppMapping == null)
            {
                return;
            }

            var mstKintoneApps1 = _context.MstKintoneApp
                .Include(x => x.MstKintoneEnviroment)
                .Where(x => x.MstKintoneEnviromentID == mstKintoneAppMapping.MstKintoneEnviromentID1)
                .ToList();

            var mstKintoneAppsNewList1 = new List<object>();
            foreach (var mstKintoneApp in mstKintoneApps1)
                mstKintoneAppsNewList1.Add(new
                {
                    MstKintoneAppID = mstKintoneApp.MstKintoneAppID,
                    AppName = ((mstKintoneApp.IsDeleted) ? ("(削除済) ") : "") +
                            " アプリID:" + mstKintoneApp.AppId +
                            " アプリ名:" + mstKintoneApp.AppName
                });

            ViewData["MstKintoneAppID1"] = new SelectList(mstKintoneAppsNewList1, "MstKintoneAppID", "AppName");


            var mstKintoneApps2 = _context.MstKintoneApp
                .Include(x => x.MstKintoneEnviroment)
                .Where(x => x.MstKintoneEnviromentID == mstKintoneAppMapping.MstKintoneEnviromentID2)
                .ToList();

            var mstKintoneAppsNewList2 = new List<object>();
            foreach (var mstKintoneApp in mstKintoneApps2)
                mstKintoneAppsNewList2.Add(new
                {
                    MstKintoneAppID = mstKintoneApp.MstKintoneAppID,
                    AppName = ((mstKintoneApp.IsDeleted) ? ("(削除済) ") : "") +
                            " アプリID:" + mstKintoneApp.AppId +
                            " アプリ名:" + mstKintoneApp.AppName
                });

            ViewData["MstKintoneAppID2"] = new SelectList(mstKintoneAppsNewList2, "MstKintoneAppID", "AppName");
        }
    }
}
