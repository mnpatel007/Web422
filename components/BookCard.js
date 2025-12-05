import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { removeFromFavourites } from '@/lib/userData';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BookCard({ workId }) {
    const { data, error } = useSWR(`https://openlibrary.org/works/${workId}.json`, fetcher);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    const removeFav = async () => {
        // The ID in the list is now stored without "/works/" prefix
        // So we pass it directly to remove
        setFavouritesList(await removeFromFavourites(workId));
    };

    if (error) return <Card className="h-100 border-danger"><Card.Body>Error loading</Card.Body></Card>;
    if (!data) return <Card className="h-100 glass-panel border-0"><Card.Body>Loading...</Card.Body></Card>;

    return (
        <Card className="h-100 shadow-sm glass-panel border-0">
            {data.covers && (
                <Card.Img
                    variant="top"
                    src={`https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
            )}
            <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate" title={data.title}>{data.title}</Card.Title>
                <Card.Text className="small text-muted mb-3 flex-grow-1" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {typeof data.description === 'string' ? data.description : (data.description?.value || "No description available.")}
                </Card.Text>
                <Button variant="danger" size="sm" className="mt-auto w-100" onClick={removeFav}>
                    Remove Favourite
                </Button>
            </Card.Body>
        </Card>
    );
}
