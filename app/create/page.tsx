'use client';

import { addEdge, Background, BackgroundVariant, type Connection, Controls, type Edge, MiniMap, type Node, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useMemo, useState } from 'react';
import '@xyflow/react/dist/style.css';
import Navbar from '@/components/navbar';
import { Download, Play, Plus, Save } from 'lucide-react';

const StratosLogo = () => (
  <div className='flex items-center gap-4 hover:opacity-80 transition-opacity'>
    <img src='/stratos-rook.svg' alt='Stratos' width={36} height={36} className='opacity-90' />
    <img src='/stratos-logo.svg' alt='Stratos' width={160} height={32} className='opacity-90' />
  </div>
);

const NavLink = ({ text, active = false, href = '#' }: { text: string, active?: boolean, href?: string }) => (
  <a
    href={href}
    className={`tracking-[0.15em] uppercase transition-colors duration-300 font-medium text-lg ${
      active ? 'text-[#ccff00]' : 'text-gray-400 hover:text-white'
    }`}>
    {text}
  </a>
);

// Initial nodes for strategy building
const initialNodes: Node[] = [{
  id: '1',
  type: 'default',
  position: { x: 250, y: 100 },
  data: { label: 'Market Data Feed' },
  style: {
    background: '#1a1a1a',
    color: '#ccff00',
    border: '1px solid #ccff00',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600'
  }
}, {
  id: '2',
  type: 'default',
  position: { x: 250, y: 250 },
  data: { label: 'Strategy Logic' },
  style: {
    background: '#1a1a1a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600'
  }
}];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ccff00' } }];

// Instrument categories for the sidebar
const instruments = [
  { id: 'data', name: 'Data Sources', items: ['Price Feed', 'Volume Data', 'Order Book', 'Social Signals'] },
  { id: 'indicators', name: 'Indicators', items: ['RSI', 'MACD', 'Moving Average', 'Bollinger Bands'] },
  { id: 'logic', name: 'Logic Nodes', items: ['If/Then', 'And/Or', 'Compare', 'Timer'] },
  { id: 'execution', name: 'Execution', items: ['Buy Order', 'Sell Order', 'Stop Loss', 'Take Profit'] },
  { id: 'risk', name: 'Risk Management', items: ['Position Size', 'Max Drawdown', 'Portfolio Balance'] }
];

export default function CreatePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('data');
  const [name, setName] = useState('Untitled Strategy');
  const [description, setDescription] = useState('Describe your strategy goals and logic.');
  const [creator, setCreator] = useState('0x...');
  const [version, setVersion] = useState('1.0.0');
  const [tagsInput, setTagsInput] = useState('yield, momentum');
  const [category, setCategory] = useState('arbitrage');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);

  const addNode = (label: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 500 + 100, y: Math.random() * 400 + 100 },
      data: { label },
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600'
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const parsedTags = useMemo(() => tagsInput.split(',').map((t) => t.trim()).filter(Boolean), [tagsInput]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const payload = {
        name,
        description,
        creator,
        version,
        category,
        riskLevel,
        tags: parsedTags,
        // Include the current graph so the API can persist user design
        graph: { nodes, edges }
      };

      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to save strategy (${res.status})`);
      }

      const data = await res.json();
      setSaveSuccess(`Strategy created: ${data?.data?.id || 'success'}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save strategy');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='h-screen bg-[#050505] text-white font-rajdhani overflow-hidden flex flex-col'>
      <Navbar />

      {/* Main Content */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Left Sidebar - Instruments */}
        <div className='w-64 bg-[#0a0a0a] border-r border-gray-800 overflow-y-auto'>
          <div className='p-4 border-b border-gray-800'>
            <h2 className='text-sm font-bold text-gray-400 tracking-wider uppercase mb-4'>Strategy Nodes</h2>
            <button className='w-full bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold py-2 px-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2'>
              <Plus size={16} />
              New Strategy
            </button>
          </div>

          {instruments.map((category) => (
            <div key={category.id} className='border-b border-gray-800'>
              <button
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className='w-full p-4 text-left hover:bg-gray-900 transition-colors flex items-center justify-between'>
                <span className='text-sm font-semibold uppercase tracking-wide'>{category.name}</span>
                <span className='text-gray-500 text-xs'>{category.items.length}</span>
              </button>
              {selectedCategory === category.id && (
                <div className='bg-[#0d0d0d] p-2'>
                  {category.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => addNode(item)}
                      className='w-full text-left px-4 py-2.5 hover:bg-gray-800 rounded text-sm text-gray-300 hover:text-[#ccff00] transition-colors flex items-center gap-2'>
                      <Plus size={14} className='text-[#ccff00]' />
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Canvas Area + Meta panel */}
        <div className='flex-1 flex'>
          <div className='flex-1 flex flex-col'>
            {/* Top Toolbar */}
            <div className='bg-[#0a0a0a] border-b border-gray-800 p-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-[#ccff00] text-sm font-bold uppercase tracking-wider'>Strategy Builder</span>
                <span className='text-gray-500 text-xs'>•</span>
                <span className='text-gray-500 text-sm'>{name || 'Untitled Strategy'}</span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className='flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors disabled:opacity-50'>
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save to API'}
                </button>
                <button className='flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors'>
                  <Download size={16} />
                  Export
                </button>
                <button className='flex items-center gap-2 px-4 py-2 bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold rounded text-sm transition-colors'>
                  <Play size={16} />
                  Test Strategy
                </button>
              </div>
            </div>

            {/* React Flow Canvas */}
            <div className='flex-1 bg-[#050505]'>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className='bg-[#050505]'>
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color='#222' />
                <Controls className='bg-gray-900 border border-gray-800' />
                <MiniMap
                  className='bg-gray-900 border border-gray-800'
                  nodeColor={(node) => {
                    if (node.data.label === 'Market Data Feed') return '#ccff00';
                    return '#444';
                  }} />
              </ReactFlow>
            </div>
          </div>

          {/* Strategy metadata panel */}
          <div className='w-96 border-l border-gray-800 bg-[#0a0a0a] overflow-y-auto p-4 space-y-4'>
            <div>
              <h3 className='text-sm font-bold text-gray-300 uppercase tracking-wider mb-3'>Strategy Details</h3>
              <label className='block text-xs text-gray-500 mb-1'>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none'
                placeholder='Strategy name' />
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none h-20 resize-none'
                placeholder='What does this strategy do?' />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Creator (wallet)</label>
                <input
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none'
                  placeholder='0x...' />
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Version</label>
                <input
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none'
                  placeholder='1.0.0' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none'
                  placeholder='arbitrage' />
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Risk Level</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}
                  className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none'>
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                </select>
              </div>
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>Tags (comma separated)</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className='w-full bg-black border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#ccff00] outline-none'
                placeholder='yield, momentum' />
              <p className='text-xs text-gray-500 mt-1'>Parsed: {parsedTags.join(', ') || 'none'}</p>
            </div>
            <div className='space-y-2'>
              {saveError && <div className='text-xs text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2'>{saveError}</div>}
              {saveSuccess && (
                <div className='text-xs text-green-400 bg-green-950/40 border border-green-900 rounded px-3 py-2'>{saveSuccess}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
