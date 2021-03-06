import React, { useContext, useState, useEffect } from 'react';
import Search from '../Search';
import Userbox from '../Userbox';
import CutIcon from '../../svg/CutIcon';
import useFireBase from '../../CustomHook/useFireBase';
import Interact from '../../utils/firebase/chat';
import { DataContext } from '../../context/Appcontext';
import useQuery from '../../CustomHook/useQuery';

const SideAddToGroup = ({ setAddGroup }) => {
	const [allUsers] = useFireBase(Interact.getAllUsers);
	const [thisGroupData] = useContext(DataContext);
	const [ query, setQuery] = useState('');
	const [filtered, setFiltered] = useQuery(allUsers, query, 'phone_number');

	useEffect(() => {
		if (query === '') {
			setFiltered(allUsers);
		}
	}, [query, filtered, setFiltered, allUsers]);

	return (
		<div className='add-to-group-wrap z-50 flex fixed inset-0 w-screen h-screen'>
			<div
				onClick={() => setAddGroup(false)}
				className='modal flex-grow bg-gray-50'
			></div>
			<div className='add-to-group w-full md:min-w-md max-w-lg side-bar  md:w-3/12 bg-green-1100'>
				<div className='recent-chat-header px-8 w-100 h-20 flex justify-center items-center'>
					<div onClick={() => setAddGroup(false)} className='cursor-pointer'>
						<CutIcon />
					</div>
					<h3 className=' flex-grow text-white text-center font-bold'>
						Add To Group
					</h3>
				</div>
				<Search placeholder='Search to add to a group' setQuery={setQuery}/>
				{!allUsers ?  <p className="text-center text-white">No User yet.</p> : (
					<>
				<div className='messages pt-4 overflow-y-scroll'>
					{ filtered && thisGroupData &&
						filtered.map((member, index) => {
							const { name, phone_number, avatar, groups } = member;
							const groupIds =
								groups && Object.values(groups).map(({ room_id }) => room_id);

							// if (!groups || groupIds && !groupIds.includes(thisGroupData.id)) {
								return (
									<Userbox
										bool = {groupIds && !groupIds.includes(thisGroupData.id)} //new
										member={member}
										setAddGroup={setAddGroup}
										name={name}
										phone_number={phone_number}
										avatar={avatar}
										key={index}
									/>
								);
							// }
						})}
					</div>

				</>)}
			</div>
		</div>
	);
};

export default SideAddToGroup;
