"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  MapPin,
  Clock,
  Users,
  Maximize2,
  Layers,
  CheckCircle2,
  ExternalLink,
  Info,
  Store,
  ListTodo,
  Hammer,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import ContentLoader from "../../ContentLoader";

const WORKFLOW_PREVIEW_LIMIT = 2;
const TOOLKIT_PREVIEW_LIMIT = 2;

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params?.id;
  const router = useRouter();

  const { fetchOneService, service, loading, error } = useServiceStoreCompany();

  const [activePkgIdx, setActivePkgIdx] = useState(0);
  const [showFullWorkflow, setShowFullWorkflow] = useState(false);
  const [showFullToolkit, setShowFullToolkit] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const workflowRef = useRef(null);
  const toolkitRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  useEffect(() => {
    if (serviceId) fetchOneService(serviceId);
  }, [serviceId, fetchOneService]);

  const data = service?.data || service || {};
  const packages = data.service_packages || data.packages || [];
  const currentPkg = packages[activePkgIdx] || null;

  useEffect(() => {
    if (activePkgIdx >= packages.length) setActivePkgIdx(0);
  }, [packages.length, activePkgIdx]);

  useEffect(() => {
    setShowFullWorkflow(false);
    setShowFullToolkit(false);
  }, [activePkgIdx]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainImage =
    data.images?.[0]?.url ||
    data.images?.[0]?.image_url ||
    "/placeholder-image.png";

  const ownerLogo =
    data.owner?.logo || data.owner?.logo_url || "/placeholder-image.png";

  const workflowGroups = currentPkg?.task_groups || [];

  const totalWorkflowTasks = useMemo(() => {
    return workflowGroups.reduce((total, group) => {
      return total + (group.task_items || group.items || []).length;
    }, 0);
  }, [workflowGroups]);

  const toolkitItems = currentPkg?.included_items || [];

  const visibleToolkitItems = showFullToolkit
    ? toolkitItems
    : toolkitItems.slice(0, TOOLKIT_PREVIEW_LIMIT);

  if (loading) {
    return (
      <ContentLoader
        title="Loading Service"
        subtitle="Preparing service details..."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] p-10 shadow-sm text-center max-w-md">
          <h1 className="text-2xl font-black text-slate-900">
            Failed to load service
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data?.id) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] p-10 shadow-sm text-center max-w-md">
          <h1 className="text-2xl font-black text-slate-900">
            Service not found
          </h1>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex gap-3">
          <div className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-white shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {data.status || "active"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/owner/services/${data.id}/edit`)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:shadow-xl hover:shadow-indigo-200 transition-all"
          >
            MANAGE SERVICE
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 relative group">
            <div className="relative aspect-[16/8] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={mainImage}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                alt={data.title || "Service"}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute -bottom-6 left-6 right-6 bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-600 p-1 rounded-md text-white">
                      <Store size={12} />
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      {data.category?.name || "Service"}
                    </span>
                  </div>

                  <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                    {data.title || "Untitled Service"}
                  </h1>
                </div>

                <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-white">
                  <div className="w-12 h-12 relative rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={ownerLogo}
                      fill
                      className="object-cover"
                      alt={data.owner?.business_name || "Provider"}
                      unoptimized
                    />
                  </div>

                  <div className="pr-4 text-left">
                    <p className="text-[10px] font-black uppercase text-slate-400 leading-none">
                      Provider
                    </p>

                    <p className="text-sm font-black text-slate-800">
                      {data.owner?.business_name || "Unknown Provider"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-6 pt-6 lg:pt-0 text-left">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>

                <h3 className="text-lg font-black leading-tight tracking-tight">
                  Service Location
                </h3>

                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                  {data.owner?.address || "No address provided"}
                </p>
              </div>

              {data.owner?.map_url && (
                <a
                  href={data.owner.map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-indigo-600 transition-colors"
                >
                  OPEN IN NAVIGATION <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-wrap items-center gap-3">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1">
            {packages.map((pkg, idx) => (
              <button
                key={pkg.id || idx}
                type="button"
                onClick={() => setActivePkgIdx(idx)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activePkgIdx === idx
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-slate-500 hover:bg-white/50"
                }`}
              >
                {pkg.title || `Package ${idx + 1}`}
              </button>
            ))}
          </div>

          {data.created_at && (
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-auto">
              Last Updated {new Date(data.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {!currentPkg ? (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-black text-slate-700">
              No packages available
            </h3>
            <p className="text-sm font-bold text-slate-400 mt-2">
              This service does not have pricing packages yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activePkgIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
            >
              <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 flex flex-col justify-between border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10 space-y-10">
                  <div className="space-y-1">
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
                      Package Investment
                    </p>

                    <div className="flex flex-col">
                      <h2 className="text-6xl font-black tracking-tighter text-slate-900">
                        ${Number(currentPkg.price || 0).toFixed(0)}
                        <span className="text-2xl text-slate-300">.00</span>
                      </h2>

                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                        {(currentPkg.billing_type || "one_time").replace(
                          "_",
                          " "
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    <PkgDetail
                      icon={Clock}
                      label="Duration"
                      value={`${currentPkg.duration_hours || 0}h`}
                    />
                    <PkgDetail
                      icon={Users}
                      label="Team Size"
                      value={`${currentPkg.workers_count || 0} Staff`}
                    />
                    <PkgDetail
                      icon={Maximize2}
                      label="Capacity"
                      value={`${currentPkg.max_area_m2 || 0}m²`}
                    />
                    <PkgDetail
                      icon={Layers}
                      label="Structure"
                      value={`${currentPkg.floor_number || 0} Floor`}
                    />
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50" />
              </div>

              <div
                ref={workflowRef}
                className="lg:col-span-5 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col scroll-mt-8"
              >
                <div className="flex items-center justify-between gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <ListTodo size={20} />
                    </div>

                    <h3 className="text-xl font-black tracking-tight">
                      Execution{" "}
                      <span className="text-indigo-600">Workflow</span>
                    </h3>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {totalWorkflowTasks} Tasks
                  </span>
                </div>

                <div className="flex-1 space-y-6">
                  {workflowGroups.length === 0 ? (
                    <EmptyState
                      icon={ListTodo}
                      title="No workflow added"
                      text="This package does not have checklist tasks yet."
                    />
                  ) : (
                    <>
                      {(() => {
                        let shownTasks = 0;

                        return workflowGroups.map((group) => {
                          const tasks = group.task_items || group.items || [];

                          const visibleTasks = showFullWorkflow
                            ? tasks
                            : tasks.filter(() => {
                                if (shownTasks >= WORKFLOW_PREVIEW_LIMIT) {
                                  return false;
                                }

                                shownTasks += 1;
                                return true;
                              });

                          if (visibleTasks.length === 0) return null;

                          return (
                            <div
                              key={group.id}
                              className="relative pl-8 border-l-2 border-slate-100 pb-2 last:pb-0 text-left"
                            >
                              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full" />

                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                {group.name}
                              </h4>

                              {group.description && (
                                <p className="text-[11px] font-bold text-slate-400 mb-3 leading-relaxed">
                                  {group.description}
                                </p>
                              )}

                              <div className="space-y-2">
                                {visibleTasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group/task"
                                  >
                                    <div>
                                      <span className="text-xs font-bold text-slate-700">
                                        {task.title}
                                      </span>

                                      {task.description && (
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 line-clamp-2">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>

                                    <CheckCircle2
                                      size={14}
                                      className="text-emerald-500 opacity-0 group-hover/task:opacity-100 transition-opacity shrink-0"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        });
                      })()}

                      {totalWorkflowTasks > WORKFLOW_PREVIEW_LIMIT && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowFullWorkflow((prev) => !prev);
                            scrollToSection(workflowRef);
                          }}
                          className="w-full mt-4 py-4 rounded-2xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          {showFullWorkflow
                            ? "Show Less"
                            : `See More (${
                                totalWorkflowTasks - WORKFLOW_PREVIEW_LIMIT
                              } more)`}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6 text-left">
                <div
                  ref={toolkitRef}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full scroll-mt-8"
                >
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                        <Hammer size={20} />
                      </div>

                      <h3 className="text-lg font-black tracking-tight text-slate-800">
                        Toolkit
                      </h3>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {toolkitItems.length} Items
                    </span>
                  </div>

                  {toolkitItems.length === 0 ? (
                    <EmptyState
                      icon={Hammer}
                      title="No toolkit"
                      text="This package does not have included items yet."
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {visibleToolkitItems.map((item) => {
                          const itemImage =
                            item.image_url ||
                            item.url ||
                            "/placeholder-image.png";

                          return (
                            <div
                              key={item.id}
                              className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-100"
                            >
                              <Image
                                src={itemImage}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                alt={item.name || "Included item"}
                                unoptimized
                              />

                              <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity text-left">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest">
                                  {item.name}
                                </p>

                                <p className="text-white/70 text-[8px] font-bold mt-1 line-clamp-2">
                                  {item.description || "No description"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {toolkitItems.length > TOOLKIT_PREVIEW_LIMIT && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowFullToolkit((prev) => !prev);
                            scrollToSection(toolkitRef);
                          }}
                          className="w-full mt-5 py-4 rounded-2xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"
                        >
                          {showFullToolkit
                            ? "Show Less"
                            : `See More (${
                                toolkitItems.length - TOOLKIT_PREVIEW_LIMIT
                              } more)`}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10 text-left">
          <div className="shrink-0 w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center">
            <Info size={32} />
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Service Philosophy
            </h4>

            <p className="text-slate-500 font-medium leading-relaxed max-w-4xl">
              {data.description || "No description provided."}
            </p>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[999] w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-300 flex items-center justify-center hover:bg-slate-900 transition-all active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function PkgDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <div className="flex items-center gap-2 text-indigo-400">
        <Icon size={14} />
        <span className="text-[8px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>

      <p className="text-sm font-black tracking-tight">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="py-10 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
      <Icon size={36} className="mx-auto text-slate-300 mb-3" />
      <h4 className="text-sm font-black text-slate-600">{title}</h4>
      <p className="text-xs font-bold text-slate-400 mt-1 px-4">{text}</p>
    </div>
  );
}
