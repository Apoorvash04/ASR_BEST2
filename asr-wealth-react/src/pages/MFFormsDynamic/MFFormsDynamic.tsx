import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoDownloadOutline, IoOpenOutline, IoDocumentTextOutline, IoSearchOutline, IoChevronDown } from 'react-icons/io5';
import './MFFormsTailwind.css';

interface FormFile {
  name: string; // Form name without extension
  path: string; // URL path for the iframe
}

interface FundData {
  fundName: string;
  forms: FormFile[];
}

// Fetch all PDFs from the public folder dynamically
const pdfFiles = import.meta.glob('/public/mf_forms/**/*.pdf');

const MFFormsDynamic: React.FC = () => {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [isFundDropdownOpen, setIsFundDropdownOpen] = useState(false);
  const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false);

  useEffect(() => {
    const fundsMap = new Map<string, FormFile[]>();

    Object.keys(pdfFiles).forEach(key => {
      // Extract fund name and form name. e.g., "/public/mf_forms/HDFC Mutual Fund/SIP Registration Form.pdf"
      const match = key.match(/\/public\/mf_forms\/([^/]+)\/(.+)\.pdf$/i);
      if (match) {
        const fundName = match[1];
        const formName = match[2];
        const path = key.replace('/public', '');

        if (!fundsMap.has(fundName)) {
          fundsMap.set(fundName, []);
        }
        fundsMap.get(fundName)!.push({ name: formName, path });
      }
    });

    const parsedFunds: FundData[] = Array.from(fundsMap.entries()).map(([fundName, forms]) => ({
      fundName,
      forms: forms.sort((a, b) => a.name.localeCompare(b.name))
    })).sort((a, b) => a.fundName.localeCompare(b.fundName));

    setFunds(parsedFunds);
  }, []);

  const filteredFunds = useMemo(() => {
    if (!searchTerm) return funds;
    return funds.filter(fund => 
      fund.fundName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [funds, searchTerm]);

  const currentFund = useMemo(() => {
    return funds.find(f => f.fundName === selectedFund);
  }, [funds, selectedFund]);

  const currentForm = useMemo(() => {
    return currentFund?.forms.find(f => f.name === selectedForm);
  }, [currentFund, selectedForm]);

  const handleFundSelect = (fundName: string) => {
    setSelectedFund(fundName);
    setSelectedForm(''); // Reset form when fund changes
    setIsFundDropdownOpen(false);
    setSearchTerm('');
  };

  const handleFormSelect = (formName: string) => {
    setSelectedForm(formName);
    setIsFormDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-slate-900 text-white py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-sans"
          >
            MF Forms
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-24 bg-yellow-400 mx-auto mb-6 rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-sans"
          >
            Access and download all mutual fund forms in one place.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 border border-slate-100"
        >
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-sans">
            
            {/* Fund Selection */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Fund</label>
              <div 
                className={`w-full bg-slate-50 border ${isFundDropdownOpen ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'} rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all duration-200`}
                onClick={() => setIsFundDropdownOpen(!isFundDropdownOpen)}
              >
                <span className={`truncate ${selectedFund ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                  {selectedFund || 'Please select a mutual fund...'}
                </span>
                <IoChevronDown className={`text-slate-400 transition-transform duration-300 ${isFundDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isFundDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-80 flex flex-col overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="relative">
                        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search Fund..." 
                          className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto p-2 custom-scrollbar">
                      {filteredFunds.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">No funds found</div>
                      ) : (
                        filteredFunds.map(fund => (
                          <div 
                            key={fund.fundName}
                            className={`p-3 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedFund === fund.fundName ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                            onClick={() => handleFundSelect(fund.fundName)}
                          >
                            {fund.fundName}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form Selection */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Form</label>
              <div 
                className={`w-full border rounded-xl p-4 flex justify-between items-center transition-all duration-200 ${
                  !selectedFund 
                    ? 'bg-slate-100/50 border-slate-200 cursor-not-allowed opacity-70' 
                    : isFormDropdownOpen 
                      ? 'bg-slate-50 border-primary ring-2 ring-primary/20 cursor-pointer' 
                      : 'bg-slate-50 border-slate-200 cursor-pointer'
                }`}
                onClick={() => selectedFund && setIsFormDropdownOpen(!isFormDropdownOpen)}
              >
                <span className={`truncate ${selectedForm ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                  {selectedForm || (selectedFund ? 'Select a form...' : 'Waiting for fund selection...')}
                </span>
                <IoChevronDown className={`text-slate-400 transition-transform duration-300 ${isFormDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isFormDropdownOpen && selectedFund && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-40 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-80 overflow-y-auto p-2 custom-scrollbar"
                  >
                    {currentFund?.forms.map(form => (
                      <div 
                        key={form.name}
                        className={`p-3 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedForm === form.name ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                        onClick={() => handleFormSelect(form.name)}
                      >
                        <div className="flex items-center gap-3">
                          <IoDocumentTextOutline className={selectedForm === form.name ? 'text-primary' : 'text-slate-400'} />
                          <span className="truncate">{form.name}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Preview & Actions Area */}
          <div className="mt-12 font-sans">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              PDF Preview
              {currentForm && <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{currentForm.name}</span>}
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[400px] h-[750px] relative transition-all duration-300">
              {!selectedFund ? (
                <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <IoSearchOutline className="text-3xl text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-500">Please select a mutual fund.</p>
                  <p className="text-sm mt-2 max-w-sm">Choose a fund from the dropdown above to view its available forms.</p>
                </div>
              ) : !selectedForm ? (
                <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <IoDocumentTextOutline className="text-3xl text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-500">Please select a form to preview.</p>
                  <p className="text-sm mt-2 max-w-sm">You selected {selectedFund}. Now choose a specific form to preview and download.</p>
                </div>
              ) : currentForm ? (
                <iframe 
                  src={`${currentForm.path}#toolbar=0&navpanes=0`} 
                  className="w-full h-full border-0 bg-white"
                  title={`${selectedFund} - ${selectedForm}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-red-400 p-8 text-center">
                  <p className="text-lg font-medium">Form not available.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a 
                href={currentForm?.path || '#'}
                download={currentForm ? `${selectedFund} - ${selectedForm}.pdf` : undefined}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  currentForm 
                    ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                onClick={(e) => !currentForm && e.preventDefault()}
              >
                <IoDownloadOutline className="text-xl" />
                Download Form
              </a>
              
              <a 
                href={currentForm?.path || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold border-2 transition-all duration-300 ${
                  currentForm 
                    ? 'border-primary text-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1' 
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                onClick={(e) => !currentForm && e.preventDefault()}
              >
                <IoOpenOutline className="text-xl" />
                Open Full Screen
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default MFFormsDynamic;
