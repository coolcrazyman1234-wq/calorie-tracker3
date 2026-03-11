import React, { useState, useEffect } from 'react';
import { analyzeImage } from './groqClient';
import { Camera, Send, Trash2, Target, Plus, Utensils } from 'lucide-react';

export default function App() {
    const [image, setImage] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [calories, setCalories] = useState(() => parseInt(localStorage.getItem("kcal")) || 0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("logs")) || []);

    useEffect(() => {
        localStorage.setItem("kcal", calories);
        localStorage.setItem("logs", JSON.stringify(history));
    }, [calories, history]);

    const handleFile = (e) => {
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(e.target.files[0]);
    };

    const askAI = async () => {
        if (!image || !prompt) return alert("Upload a photo and type a prompt!");
        setLoading(true);
        try {
            const res = await analyzeImage(image, prompt);
            setResult(res);
            setHistory([{ id: Date.now(), text: prompt, time: new Date().toLocaleTimeString() }, ...history]);
        } catch (err) { alert("Error! Check your Vercel API Key."); }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '450px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>🥗 SmartTrack AI</h2>
                <button onClick={() => { setCalories(0); setHistory([]); }} style={{ border: 'none', background: 'none', color: 'red' }}><Trash2 /></button>
            </div>

            <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><Target size={16} /> Daily Goal</span>
                    <span>{calories} / 2000 kcal</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#ddd', borderRadius: '4px', marginTop: '10px' }}>
                    <div style={{ width: `${(calories / 2000) * 100}%`, height: '100%', background: '#007AFF', borderRadius: '4px' }}></div>
                </div>
            </div>

            <div style={{ border: '2px dashed #ccc', borderRadius: '15px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <input type="file" accept="image/*" onChange={handleFile} id="imgInp" hidden />
                <label htmlFor="imgInp" style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}>
                    {image ? <img src={image} style={{ width: '100%' }} /> : <><Camera size={40} /><p>Snap Food or Menu</p></>}
                </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input type="text" placeholder="Prompt (e.g. 'Estimate calories')" value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
                <button onClick={askAI} disabled={loading} style={{ background: '#007AFF', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 15px' }}>
                    {loading ? '...' : <Send size={20} />}
                </button>
            </div>

            {result && <div style={{ background: '#eef6ff', padding: '15px', borderRadius: '10px', marginTop: '20px' }}>{result}</div>}

            <h3 style={{ marginTop: '30px' }}><Utensils size={18} /> History</h3>
            {history.map(h => <div key={h.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>{h.time}: {h.text}</div>)}
        </div>
    );
}