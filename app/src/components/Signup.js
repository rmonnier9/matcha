import React from 'react'

const Signup = () => (
  <div className="signin">
    <form className="form-signin">
      <h2 className="form-signin-heading">Sign up</h2>
      <label htmlFor="inputEmail" className="sr-only">Email address</label>
      <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus=""/>
      <label htmlFor="inputPassword" className="sr-only">Password</label>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
      <label htmlFor="inputPassword" className="sr-only">Confirm password</label>
      <input type="password" id="inputPassword" className="form-control" placeholder="Confirm password" required=""/>
      <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
    </form>
  </div>
)

export default Signup
