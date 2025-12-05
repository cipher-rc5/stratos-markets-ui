'use client';
import { addEdge, Background, BackgroundVariant, type Connection, Controls, type Edge, MiniMap, type Node, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { Download, Play, Plus, Save } from 'lucide-react';
import Navbar from '../../components/navbar';

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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#ccff00' } }, eds)),
    [setEdges]
  );

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

        {/* Main Canvas Area */}
        <div className='flex-1 flex flex-col'>
          {/* Top Toolbar */}
          <div className='bg-[#0a0a0a] border-b border-gray-800 p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-[#ccff00] text-sm font-bold uppercase tracking-wider'>Strategy Builder</span>
              <span className='text-gray-500 text-xs'>•</span>
              <span className='text-gray-500 text-sm'>Untitled Strategy</span>
            </div>
            <div className='flex items-center gap-3'>
              <button className='flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors'>
                <Save size={16} />
                Save
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
      </div>
    </div>
  );
}
