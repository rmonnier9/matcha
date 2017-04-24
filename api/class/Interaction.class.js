class Interaction {
  static create(current, target) {
	 return {"current": current, "target": target, "hasLiked": false, "hasBlocked": false, "hasReported": false}
  }
}

export default Interaction
