import React						from 'react'

import EncartLeft from './EncartLeft.js'
import EncartRight from './EncartRight.js'
import Image from './Image.js'

export default class Profile extends React.Component {
	render() {
		const {
					profile,
					onReportClick,
					onBlockClick,
					alreadyBlocked,
					alreadyLiked,
					myprofile,
					onLikeClick
				} = this.props
		return (
			<div>
				<h1>{profile.login}</h1>
				<EncartLeft
					profile={profile}/>
				<EncartRight
					profile={profile}/>
				<Image
					pictures={profile.pictures}
					login={profile.login}
				/>
				{!myprofile &&
					<div className="likeAction">
						{!alreadyLiked &&
							<span className="like" onClick={(e) => onLikeClick(e, true)}>Like this.</span>
						}
						{alreadyLiked &&
							<span className="like" onClick={(e) => onLikeClick(e, false)}>Unlike this.</span>
						}
					</div>
				}
				{!myprofile &&
					<div className="blockReport">
						<span className="fake" onClick={(e) => onReportClick(e)}>Fake account ?</span>
						{!alreadyBlocked &&
							<span className="block" onClick={(e) => onBlockClick(e, true)}>Block this.</span>
						}
						{alreadyBlocked &&
							<span className="block" onClick={(e) => onBlockClick(e, false)}>Unblock this.</span>
						}
					</div>
				}
			</div>
		)
	}
}
