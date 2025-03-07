import React, { useState } from 'react';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface PlanDisplayProps {
  title: string;
  sections: Section[];
  onDownload: () => void;
  onEdit: (sectionId: string) => void;
}

export default function PlanDisplay({
  title,
  sections,
  onDownload,
  onEdit,
}: PlanDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.map((section) => section.id)
  );

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">{title}</h2>
        
        <div className="flex mt-4 space-x-4">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <button className="text-gray-500">
                  {expandedSections.includes(section.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
              </div>
              
              {expandedSections.includes(section.id) && (
                <div className="p-4 border-t">
                  <div className="prose max-w-none">
                    {section.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => onEdit(section.id)}
                      className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit this section
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 