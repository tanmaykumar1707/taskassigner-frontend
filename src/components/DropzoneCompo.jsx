import React  from 'react'
import { useDropzone } from 'react-dropzone';
import toast from "react-hot-toast";

function DropzoneCompo({onFilesAccepted}) {
    const { acceptedFiles, getRootProps, getInputProps  } = useDropzone({
        //  accept: ['.pdf', '.csv', '.doc', '.docx', '.xls', '.xlsx'],
          multiple: true,
          onDrop: (acceptedFiles) => {
            const allowedFormats = ['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx'];
            const invalidFiles = [];
      
            const filteredFiles = acceptedFiles.filter(file => {
              const fileExtension = file.name.split('.').pop();
             
              if (!allowedFormats.includes(fileExtension)) {
                invalidFiles.push(file.name);
                return false; // Filter out invalid files
              }else
                return true; // Keep valid files
            });
      
            if (invalidFiles.length > 0) {
              toast.error('The following files have invalid formats: ' + invalidFiles.join(', '));
            } 
            onFilesAccepted(filteredFiles);
            acceptedFiles=[]
  
          },
        });
     
  return (
    <> 
    <div
            {...getRootProps({ className: "dropzone" })}
            className="dropzone border-2 border-dashed border-gray-400 rounded-md p-4 text-center"
            >
            <input
                {...getInputProps({
                accept: ".pdf,.csv,.doc,.docx,.xls,.xlsx",
                })}
            />
            <p className="text-gray-600">
                Drag 'n' drop some files here, or click to
                select files
            </p>
    </div>
    </>
   )}

export default DropzoneCompo