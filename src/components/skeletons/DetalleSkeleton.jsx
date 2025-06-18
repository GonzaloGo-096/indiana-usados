import React from 'react'

const DetalleSkeleton = () => (
    <div className="container py-5">
        <div className="row">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="placeholder-glow">
                        <div className="placeholder w-100" style={{ height: '400px' }}></div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                        <div className="placeholder-glow">
                            <h2 className="card-title placeholder col-8 mb-4"></h2>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-4"></div>
                                <div className="placeholder col-4"></div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-3"></div>
                                <div className="placeholder col-3"></div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-5"></div>
                                <div className="placeholder col-5"></div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-4"></div>
                                <div className="placeholder col-4"></div>
                            </div>
                            <div className="placeholder col-12 mt-4" style={{ height: '100px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default DetalleSkeleton 