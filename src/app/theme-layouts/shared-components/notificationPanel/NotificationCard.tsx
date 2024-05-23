import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { NotificationModelType } from 'app/theme-layouts/shared-components/notificationPanel/models/NotificationModel';
import { MouseEvent } from 'react';

type NotificationCardProps = {
	// item: NotificationModelType;
	item: any
	className?: string;
};

/**
 * The notification card.
 */
function NotificationCard(props: NotificationCardProps) {
	const { item, className } = props;

	return (
		<Card
			className={clsx(
				'relative flex min-h-64 w-full items-center space-x-8 rounded-16 p-20 shadow',
				className
			)}
			elevation={0}
		>

			<div className="flex flex-auto flex-col">
				{item.title && <Typography className="line-clamp-1 font-semibold">{item.title}</Typography>}

				{item.message && (
					<div
						className="line-clamp-2"
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{ __html: item.message }}
					/>
				)}

				{item.createAt && (
					<Typography
						className="mt-8 text-sm leading-none "
						color="text.secondary"
					>
						{formatDistanceToNow(new Date(item.createAt), { addSuffix: true })}
					</Typography>
				)}
			</div>
		</Card>
	);
}

export default NotificationCard;
