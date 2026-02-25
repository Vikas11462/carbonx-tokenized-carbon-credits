from pydantic import BaseModel

class ProjectInput(BaseModel):
    location: str
    areaHectares: float
    co2Kg: int


class VerificationResult(BaseModel):
    confidence: int
    proof_cid: str
    project_id: int
    tx_hash: str


class MintInput(BaseModel):
    project_id: int
    recipient: str
    amount: int


class MintResult(BaseModel):
    tx_hash: str
    status: str
