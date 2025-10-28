import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Edit, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import { memoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e1e5e9;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 15px;
  color: #666;
  font-size: 0.9rem;
`;

const ImageCell = styled(TableCell)`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ImagePreview = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e1e5e9;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.variant === 'edit') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (props.variant === 'delete') return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    return '#f8f9fa';
  }};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

const EmptyTitle = styled.h3`
  margin: 20px 0 10px;
  color: #666;
`;

const EmptySubtitle = styled.p`
  color: #999;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const DescriptionText = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function MemoryTable({ userId }) {
  const [memories, setMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState({});

  // Fetch memories on component mount
  React.useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async (search = '') => {
    setLoading(true);
    try {
      const data = await memoryAPI.search(search);
      setMemories(data);
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast.error('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchMemories(query);
    }, 500);
  };

  const handleDelete = async (memoryId) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await memoryAPI.delete(memoryId);
        toast.success('Memory deleted successfully');
        fetchMemories(searchQuery);
      } catch (error) {
        console.error('Error deleting memory:', error);
        toast.error('Failed to delete memory');
      }
    }
  };

  const handleEdit = (memory) => {
    toast.success(`Edit functionality for "${memory.title}" coming soon!`);
  };

  const toggleImages = (memoryId) => {
    setShowImages(prev => ({
      ...prev,
      [memoryId]: !prev[memoryId]
    }));
  };

  const totalMemories = memories.length;
  const totalImages = memories.reduce((sum, m) => sum + (m.images?.length || 0), 0);
  const recentMemories = memories.filter(m => {
    const memoryDate = new Date(m.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return memoryDate > weekAgo;
  }).length;

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          <Eye size={24} />
          Memory Database Table
        </TableTitle>
      </TableHeader>

      <StatsRow>
        <StatCard>
          <StatValue>{totalMemories}</StatValue>
          <StatLabel>Total Memories</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalImages}</StatValue>
          <StatLabel>Total Photos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{recentMemories}</StatValue>
          <StatLabel>This Week</StatLabel>
        </StatCard>
      </StatsRow>

      <SearchContainer>
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder="Search memories by title, location, or description..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchContainer>

      {loading ? (
        <EmptyState>
          <div>Loading...</div>
        </EmptyState>
      ) : memories.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Memories Found</EmptyTitle>
          <EmptySubtitle>Start creating memories to see them here.</EmptySubtitle>
        </EmptyState>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Photos</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {memories.map((memory) => (
              <TableRow key={memory._id}>
                <TableCell style={{ fontWeight: 600, color: '#667eea' }}>
                  {memory.title}
                </TableCell>
                <TableCell>{memory.date}</TableCell>
                <TableCell>{memory.location || 'N/A'}</TableCell>
                <TableCell>
                  <DescriptionText title={memory.description}>
                    {memory.description}
                  </DescriptionText>
                </TableCell>
                <ImageCell>
                  {memory.images && memory.images.length > 0 && (
                    <>
                      {memory.images.slice(0, showImages[memory._id] ? memory.images.length : 2).map((img, idx) => (
                        <ImagePreview
                          key={idx}
                          src={img}
                          alt={`Memory ${idx + 1}`}
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                      {memory.images.length > 2 && (
                        <ActionButton
                          onClick={() => toggleImages(memory._id)}
                          style={{ background: '#667eea', color: 'white', width: '50px', height: '50px', padding: 0 }}
                        >
                          {showImages[memory._id] ? <EyeOff size={20} /> : `+${memory.images.length - 2}`}
                        </ActionButton>
                      )}
                    </>
                  )}
                </ImageCell>
                <TableCell>
                  {new Date(memory.createdAt).toLocaleDateString()}
                </TableCell>
                <ActionCell>
                  <ActionButton variant="edit" onClick={() => handleEdit(memory)}>
                    <Edit size={16} />
                    Edit
                  </ActionButton>
                  <ActionButton variant="delete" onClick={() => handleDelete(memory._id)}>
                    <Trash2 size={16} />
                    Delete
                  </ActionButton>
                </ActionCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </TableContainer>
  );
}

export default MemoryTable;

