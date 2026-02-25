from carbonx.ai.carbon_model import predict_confidence

def verify_project_ai(location: str, area: float, co2: int) -> int:
    """
    Runs AI/ML model to generate confidence score
    """
    confidence = predict_confidence(
        location=location,
        area=int(area),
        co2=co2
    )

    if confidence < 70:
        raise ValueError("AI confidence below protocol requirement (70%)")

    return confidence
