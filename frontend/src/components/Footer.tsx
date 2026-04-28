export default function Footer() {
  return (
    <footer className="border-thick-t py-10 sm:py-16 relative overflow-hidden mt-8 sm:mt-16">
      <div className="bg-grain" />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-16 items-start">
          <div className="md:col-span-6 flex flex-col gap-4 sm:gap-6">
            <div className="heading-display text-2xl sm:text-3xl font-bold">Gooseberry</div>
            <p className="text-base sm:text-lg leading-relaxed max-w-sm">
              An advanced AI system dedicated to the precision monitoring and digital phenotyping of <i>Physalis peruviana</i>.
            </p>
          </div>

          <div className="md:col-span-6 md:text-right flex flex-col justify-between h-full gap-6 sm:gap-8">
            <div className="flex flex-col md:items-end gap-3 sm:gap-4">
              <div className="heading-sub text-editorial-charcoal">Scientific Research</div>
              <div className="flex gap-6 sm:gap-8 text-base sm:text-lg">
                <span className="hover:text-editorial-gold transition-colors cursor-pointer italic">Methodology</span>
                <span className="hover:text-editorial-gold transition-colors cursor-pointer italic">Datasets</span>
                <span className="hover:text-editorial-gold transition-colors cursor-pointer italic">Archive</span>
              </div>
            </div>
            
            <div className="text-meta text-editorial-gray leading-loose border-t border-editorial-gray/20 pt-4 mt-2 sm:mt-4 text-xs sm:text-sm">
              &copy; 2026 // PRECISION AG SYSTEMS LAB <br />
              <span className="text-editorial-charcoal">ANDES REGION // GLOBAL DEPLOYMENT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
