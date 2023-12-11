import React from 'react'

export default function InfoCard({ icon, value, label }) {
  return (
    <div>
         <div className="col-md-3 col-sm-6 my-1 p-1 min150">
            <div className="bg-white shadow-sm d-flex flex-wrap rounded-3 p-3 align-items-center">
                <div className="bg-info p-3 rounded-3 me-4">
                    {icon}
                </div>
                <div className="my-2">
                    <span className="h3">{value}</span>
                    <br />
                    <span className="text-muted fs-6">{label}</span>
                </div>
            </div>
        </div>
    </div>
  )
}
