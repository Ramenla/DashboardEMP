import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';

const ProjectModal = ({ open, onCancel, onSave, project, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (project) {
            form.setFieldsValue(project);
        } else {
            form.resetFields();
        }
    }, [project, form, open]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onSave(values);
        });
    };

    return (
        <Modal
            title={project ? 'Edit Proyek' : 'Tambah Proyek Baru'}
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={700}
            okText="Simpan"
            cancelText="Batal"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    progress: 0,
                    target: 0,
                    status: 'Berjalan',
                    priority: 'Sedang'
                }}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="id"
                            label="Kode Project"
                            rules={[{ required: true, message: 'Masukkan kode project' }]}
                        >
                            <Input disabled={!!project} placeholder="Contoh: EXP-101" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name="name"
                            label="Nama Proyek"
                            rules={[{ required: true, message: 'Masukkan nama proyek' }]}
                        >
                            <Input placeholder="Nama lengkap proyek" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="category" label="Kategori" rules={[{ required: true }]}>
                            <Select options={[
                                { label: 'Exploration', value: 'Exploration' },
                                { label: 'Drilling', value: 'Drilling' },
                                { label: 'Operation', value: 'Operation' },
                                { label: 'Facility', value: 'Facility' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Status">
                            <Select options={[
                                { label: 'Berjalan', value: 'Berjalan' },
                                { label: 'Tertunda', value: 'Tertunda' },
                                { label: 'Kritis', value: 'Kritis' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="priority" label="Prioritas">
                            <Select options={[
                                { label: 'Rendah', value: 'Rendah' },
                                { label: 'Sedang', value: 'Sedang' },
                                { label: 'Tinggi', value: 'Tinggi' },
                                { label: 'Kritis', value: 'Kritis' },
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="manager" label="Project Manager">
                            <Input placeholder="Nama manager" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="location" label="Lokasi">
                            <Input placeholder="Lokasi proyek" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="progress" label="Progress (%)">
                            <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="target" label="Target (%)">
                            <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="budgetTotal" label="Total Budget (IDR)">
                            <InputNumber
                                className="w-full"
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ProjectModal;
