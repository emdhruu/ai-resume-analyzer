const formatMarkdown = (text: string) => {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-teal-800">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-teal-900 border-b border-gray-200 pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-teal-900">$1</h1>')
    
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    
    .replace(/^---$/gim, '<hr class="my-4 border-gray-300" />')
    
    .replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
      const isHeader = match.includes('**') || match.includes('Category') || match.includes('Strength');
      
      if (isHeader) {
        return `<tr class="bg-gray-50">${cells.map((cell: string) => 
          `<th class="px-3 py-2 text-left font-semibold text-gray-700 border border-gray-200">${cell}</th>`
        ).join('')}</tr>`;
      } else {
        return `<tr>${cells.map((cell: string) => 
          `<td class="px-3 py-2 text-gray-600 border border-gray-200 align-top">${cell}</td>`
        ).join('')}</tr>`;
      }
    })
    
    .replace(/(<tr.*?<\/tr>[\s\S]*?<tr.*?<\/tr>)/g, '<table class="w-full mb-4 border-collapse border border-gray-200 rounded">$1</table>')
    
    .replace(/\n/g, '<br />');
};

export { formatMarkdown };