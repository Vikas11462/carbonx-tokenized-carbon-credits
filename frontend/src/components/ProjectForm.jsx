import { useState, useEffect } from "react";
import { verifyProject } from "../api";
import { VERIFICATION_STEPS, PROJECT_TYPES } from "../constants";

export default function ProjectForm({ onResult }) {
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        project_id: "X-PROT-099",
        areaHectares: 12,
        co2Kg: 4200,
        location: "DEHRADUN, IND",
        projectType: "Reforestation"
    });

    useEffect(() => {
        const selected = PROJECT_TYPES.find(t => t.label === form.projectType);
        const suggested = Math.round(form.areaHectares * (selected?.factor || 200));
        setForm(prev => ({ ...prev, co2Kg: suggested }));
    }, [form.areaHectares, form.projectType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: (name === 'areaHectares' || name === 'co2Kg') ? Number(value) : value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setCurrentStep(0);

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => (prev < VERIFICATION_STEPS.length - 1 ? prev + 1 : prev));
        }, 1200);

        const { project_id, projectType, ...payload } = form;

        try {
            const res = await verifyProject(payload);
            clearInterval(stepInterval);
            setCurrentStep(VERIFICATION_STEPS.length - 1);

            setTimeout(() => {
                onResult({
                    ...res,
                    project_id: form.project_id,
                    projectType,
                    areaHectares: form.areaHectares,
                    location: form.location
                });
            }, 500);
        } catch (err) {
            clearInterval(stepInterval);
            setError("ORACLE_SYNC_FAILURE");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="professional-card animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
                <h3 className="text-xl font-bold tracking-tight">Configuration Lab</h3>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="label-text">Identifier</label>
                    <input name="project_id" value={form.project_id} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <label className="label-text">Methodology</label>
                    <select name="projectType" value={form.projectType} onChange={handleChange}>
                        {PROJECT_TYPES.map(t => <option key={t.label}>{t.label}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="label-text">Area (Hectares)</label>
                    <input type="number" name="areaHectares" value={form.areaHectares} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <label className="label-text">Target Offset (Kg CO₂)</label>
                    <input type="number" name="co2Kg" value={form.co2Kg} onChange={handleChange} />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="label-text">Deployment Coordinates</label>
                    <input name="location" value={form.location} onChange={handleChange} />
                </div>

                {error && (
                    <div className="md:col-span-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-mono text-center">
                        {error}
                    </div>
                )}

                <div className="md:col-span-2 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-4"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span className="text-xs">{VERIFICATION_STEPS[currentStep]}</span>
                            </>
                        ) : "Initiate Verification"}
                    </button>
                </div>
            </form>
        </div>
    );
}
