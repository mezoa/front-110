import React from 'react'

export default function Loading() {
  return (
    <div className='position-absolute top-50 start-50 translate-middle'>
        <button class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Loading...</span>
        </button>
    </div>
  )
}
